import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import cloudinary from "cloudinary";
import { prisma } from "@/lib/utils";
import { auth } from "@/actions/auth.actions";
import { runVideoTranscriptionJob } from "@/lib/transcription/run-video-transcription";

async function uploadWithRetry(
    buffer: Buffer,
    options: cloudinary.UploadApiOptions,
    retries = 3,
    delay = 1000
): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    options,
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            return result;
        } catch (error: any) {
            console.warn(
                `Cloudinary upload failed (attempt ${attempt}/${retries}):`,
                error.message
            );

            if (attempt === retries) {
                throw new Error(`Upload failed after ${retries} attempts`);
            }
            await new Promise((res) => setTimeout(res, delay * attempt));
        }
    }
}

export const POST = async (req: NextRequest) => {
    const { data } = await auth();
    if (!data) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const form = await req.formData();
        const file = form.get("file") as File;
        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const folderIdRaw = form.get("folderId");
        let folderId: string | null = null;
        if (typeof folderIdRaw === "string" && folderIdRaw.length > 0) {
            const folder = await prisma.folder.findFirst({
                where: { id: folderIdRaw, userId: data.sub! },
            });
            if (!folder) {
                return NextResponse.json(
                    { error: "Invalid folder" },
                    { status: 400 }
                );
            }
            folderId = folderIdRaw;
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await uploadWithRetry(buffer, {
            resource_type: "video",
            folder: "video",
            quality_analysis: true,
        });

        const thumbnail = cloudinary.v2.url((result as any).public_id, {
            resource_type: "video",
            format: "jpg",
            transformation: [
                { width: 400, height: 250, crop: "fill" },
                { start_offset: "3" },
            ],
        });

        const uploadResult = result as {
            secure_url: string;
            public_id: string;
            duration?: number;
        };

        const scheduleTranscription = Boolean(process.env.OPENAI_API_KEY);

        const video = await prisma.video.create({
            data: {
                title: `Loop | Free Screen & Video Recording Software - ${new Date().toLocaleString()}`,
                url: uploadResult.secure_url,
                userId: data.sub!,
                thumbnailUrl: thumbnail,
                duration: uploadResult.duration,
                folderId,
                cloudinaryPublicId: uploadResult.public_id,
                transcriptStatus: scheduleTranscription ? "PENDING" : "NONE",
            },
        });

        if (scheduleTranscription) {
            after(() =>
                runVideoTranscriptionJob(video.id).catch((err) =>
                    console.error("[transcription] background job error", err)
                )
            );
        }

        return NextResponse.json({ message: "File uploaded" }, { status: 200 });
    } catch (error: any) {
        console.error("Upload handler failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
