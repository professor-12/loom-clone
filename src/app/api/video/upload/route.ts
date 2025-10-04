import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

export const POST = async (req: NextRequest) => {
    try {
        const form = await req.formData();
        const file = form.get("file") as File;
        if (!file)
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );

        // Convert to buffer
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

        console.log(result);

        return NextResponse.json({
            message: "Upload successful",
            data: result,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
