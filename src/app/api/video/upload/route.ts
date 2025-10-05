import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { prisma } from "@/lib/utils";
import { auth } from "@/actions/auth.actions";

export const POST = async (req: NextRequest) => {
    const { data } = await auth();
    if (!data) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const form = await req.formData();
        const file = form.get("file") as File;
        if (!file)
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "video",
                    quality_analysis: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(buffer);
        });
        const thumbnail = cloudinary.v2.url((result as any).public_id, {
            resource_type: "video",
            format: "jpg",
            transformation: [
                { width: 400, height: 250, crop: "fill" },
                { start_offset: "3" },
            ],
        });
        console.log(result, thumbnail);
        const video = await prisma.video.create({
            data: {
                title: ("Loop | Free Screen & Video Recording Software -" +
                    new Date().toLocaleString()) as string,
                url: (result as any).secure_url,
                userId: data?.sub!,
                thumbnailUrl: thumbnail,
                duration: (result as any).duration,
            },
        });

        return NextResponse.json({ message: "File uploaded" }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
