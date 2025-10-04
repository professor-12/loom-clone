import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function POST() {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request(
        { timestamp, folder: "user_videos" },
        process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
    });
}
