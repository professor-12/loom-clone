import cloudinary from "cloudinary";
import { prisma } from "@/lib/utils";

/** OpenAI Whisper API limit for `whisper-1` (bytes). */
const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

function ensureCloudinaryConfigured() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return;
    cloudinary.v2.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

/**
 * Fetches an MP3 rendition from Cloudinary and transcribes with OpenAI Whisper.
 * Intended to run after the upload HTTP response (e.g. via Next.js `after()`).
 */
export async function runVideoTranscriptionJob(videoId: string): Promise<void> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn(
            "[transcription] OPENAI_API_KEY missing; skipping job",
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
            estimatedBytes > WHISPER_MAX_BYTES
        ) {
            await prisma.video.update({
                where: { id: videoId },
                data: {
                    transcriptStatus: "FAILED",
                    transcriptError:
                        "Derived audio exceeds Whisper file size limit (25MB)",
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
        if (buf.length > WHISPER_MAX_BYTES) {
            await prisma.video.update({
                where: { id: videoId },
                data: {
                    transcriptStatus: "FAILED",
                    transcriptError:
                        "Derived audio exceeds Whisper file size limit (25MB)",
                },
            });
            return;
        }

        const form = new FormData();
        form.append("model", "whisper-1");
        form.append(
            "file",
            new Blob([new Uint8Array(buf)], { type: "audio/mpeg" }),
            "audio.mp3"
        );

        const tr = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}` },
                body: form,
                signal: AbortSignal.timeout(600_000),
            }
        );

        if (!tr.ok) {
            const errBody = await tr.text();
            throw new Error(
                `OpenAI transcription failed (${tr.status}): ${errBody.slice(0, 400)}`
            );
        }

        const json = (await tr.json()) as { text?: string };

        await prisma.video.update({
            where: { id: videoId },
            data: {
                transcript: json.text ?? "",
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
    }
}
