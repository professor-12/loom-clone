import "server-only";

import cloudinary from "cloudinary";
import {
    GoogleGenerativeAI,
    GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import {
    GoogleAIFileManager,
    FileState,
} from "@google/generative-ai/server";
import { prisma } from "@/lib/utils";

/** Cap Cloudinary → memory fetch (Gemini accepts larger files via Files API). */
const MAX_AUDIO_BYTES = 80 * 1024 * 1024;

const TRANSCRIBE_PROMPT =
    "Transcribe all spoken words in this audio verbatim. " +
    "Output plain text only: no timestamps, bullets, labels, or commentary.";

function getGeminiApiKey(): string | undefined {
    const k =
        process.env.GEMINI_API_KEY?.trim() ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    return k || undefined;
}

/** Per-minute / daily quota is tracked per model; order matters when one model hits 429. */
const DEFAULT_TRANSCRIPTION_MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
] as const;

function geminiTranscriptionModels(): string[] {
    const single = process.env.GEMINI_TRANSCRIPTION_MODEL?.trim();
    if (single) return [single];
    const csv = process.env.GEMINI_TRANSCRIPTION_MODELS?.trim();
    if (csv) {
        return csv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [...DEFAULT_TRANSCRIPTION_MODELS];
}

function sleep(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

function parseRetryDelayMs(err: unknown): number | null {
    const msg = err instanceof Error ? err.message : String(err);
    const m = msg.match(/retry in ([\d.]+)\s*s/i);
    if (!m) return null;
    const sec = Number(m[1]);
    if (!Number.isFinite(sec)) return null;
    return Math.min(120_000, Math.max(5_000, Math.ceil(sec * 1_000)));
}

function isRateLimitOrQuota(err: unknown): boolean {
    if (err instanceof GoogleGenerativeAIFetchError && err.status === 429) {
        return true;
    }
    const msg = err instanceof Error ? err.message : String(err);
    return /429|Too Many Requests|quota exceeded|Resource exhausted/i.test(
        msg
    );
}

const RATE_LIMIT_ATTEMPTS_PER_MODEL = 4;

type ContentParts = Parameters<
    ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]
>[0];

async function generateTranscriptionWithFallback(
    apiKey: string,
    parts: ContentParts
) {
    const models = geminiTranscriptionModels();
    let lastErr: unknown = null;
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of models) {
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { maxOutputTokens: 8192 },
        });

        for (let attempt = 0; attempt < RATE_LIMIT_ATTEMPTS_PER_MODEL; attempt++) {
            try {
                return await model.generateContent(parts);
            } catch (e) {
                lastErr = e;
                if (!isRateLimitOrQuota(e)) throw e;
                if (attempt + 1 >= RATE_LIMIT_ATTEMPTS_PER_MODEL) break;
                const delay =
                    parseRetryDelayMs(e) ?? 15_000 + attempt * 15_000;
                console.warn(
                    `[transcription] ${modelName} rate limited (attempt ${attempt + 1}/${RATE_LIMIT_ATTEMPTS_PER_MODEL}), waiting ${delay}ms`
                );
                await sleep(delay);
            }
        }
        console.warn(
            `[transcription] giving up on model ${modelName}, trying next fallback if any`
        );
    }

    throw lastErr instanceof Error
        ? lastErr
        : new Error(String(lastErr ?? "Gemini transcription failed"));
}

function ensureCloudinaryConfigured() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return;
    cloudinary.v2.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

async function waitForGeminiFileReady(
    fileManager: GoogleAIFileManager,
    fileName: string
) {
    for (let i = 0; i < 120; i++) {
        const meta = await fileManager.getFile(fileName);
        if (meta.state === FileState.ACTIVE) return meta;
        if (meta.state === FileState.FAILED) {
            throw new Error(
                meta.error?.message ?? "Gemini file processing failed"
            );
        }
        await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error("Gemini file processing timed out");
}

/**
 * Derives MP3 from Cloudinary, uploads to Gemini Files API, transcribes with generateContent.
 * Runs after the upload HTTP response (e.g. via Next.js `after()`).
 */
export async function runVideoTranscriptionJob(videoId: string): Promise<void> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        console.warn(
            "[transcription] Set GEMINI_API_KEY (or GOOGLE_GENERATIVE_AI_API_KEY); skipping job",
            videoId
        );
        return;
    }

    const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: {
            id: true,
            cloudinaryPublicId: true,
            transcriptStatus: true,
        },
    });

    if (!video) return;

    if (!video.cloudinaryPublicId) {
        await prisma.video.update({
            where: { id: videoId },
            data: {
                transcriptStatus: "FAILED",
                transcriptError: "Missing Cloudinary public id for this video",
            },
        });
        return;
    }

    if (video.transcriptStatus !== "PENDING") {
        return;
    }

    ensureCloudinaryConfigured();

    const fileManager = new GoogleAIFileManager(apiKey);
    let uploadedFileName: string | null = null;

    try {
        const audioUrl = cloudinary.v2.url(video.cloudinaryPublicId, {
            resource_type: "video",
            format: "mp3",
            secure: true,
        });

        let estimatedBytes: number | null = null;
        try {
            const head = await fetch(audioUrl, { method: "HEAD" });
            const cl = head.headers.get("content-length");
            if (cl) estimatedBytes = Number(cl);
        } catch {
            /* ignore HEAD failures */
        }

        if (
            estimatedBytes !== null &&
            Number.isFinite(estimatedBytes) &&
            estimatedBytes > MAX_AUDIO_BYTES
        ) {
            await prisma.video.update({
                where: { id: videoId },
                data: {
                    transcriptStatus: "FAILED",
                    transcriptError: `Derived audio too large (${Math.round(estimatedBytes / (1024 * 1024))}MB; max ${MAX_AUDIO_BYTES / (1024 * 1024)}MB)`,
                },
            });
            return;
        }

        const audioRes = await fetch(audioUrl, {
            signal: AbortSignal.timeout(600_000),
        });
        if (!audioRes.ok) {
            throw new Error(`Audio fetch failed (${audioRes.status})`);
        }

        const buf = Buffer.from(await audioRes.arrayBuffer());
        if (buf.length > MAX_AUDIO_BYTES) {
            await prisma.video.update({
                where: { id: videoId },
                data: {
                    transcriptStatus: "FAILED",
                    transcriptError: `Derived audio too large for this pipeline (${Math.round(buf.length / (1024 * 1024))}MB; max ${MAX_AUDIO_BYTES / (1024 * 1024)}MB)`,
                },
            });
            return;
        }

        const upload = await fileManager.uploadFile(buf, {
            mimeType: "audio/mpeg",
            displayName: `video-${videoId.slice(0, 8)}`,
        });
        uploadedFileName = upload.file.name;

        const ready = await waitForGeminiFileReady(
            fileManager,
            upload.file.name
        );

        const parts: ContentParts = [
            { text: TRANSCRIBE_PROMPT },
            {
                fileData: {
                    fileUri: ready.uri,
                    mimeType: ready.mimeType,
                },
            },
        ];

        const result = await generateTranscriptionWithFallback(apiKey, parts);

        let text = "";
        try {
            text = result.response.text();
        } catch {
            const parts = result.response.candidates?.[0]?.content?.parts;
            text =
                parts
                    ?.map((p) => ("text" in p ? String(p.text) : ""))
                    .join("")
                    .trim() ?? "";
        }

        await prisma.video.update({
            where: { id: videoId },
            data: {
                transcript: text.trim(),
                transcriptStatus: "READY",
                transcriptError: null,
            },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[transcription] job failed", videoId, msg);
        try {
            await prisma.video.update({
                where: { id: videoId },
                data: {
                    transcriptStatus: "FAILED",
                    transcriptError: msg.slice(0, 500),
                },
            });
        } catch {
            /* video may have been deleted */
        }
    } finally {
        if (uploadedFileName) {
            fileManager.deleteFile(uploadedFileName).catch(() => {});
        }
    }
}
