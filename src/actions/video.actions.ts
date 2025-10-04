"use server";
import cloudinary from "cloudinary";
import { auth } from "./auth.actions";
import { prisma } from "@/lib/utils";
import { string } from "better-auth";
// import { video } from "motion/react-client";
export const upLoadVideoAction = async ({
    name,
    file,
    description,
}: {
    name: string;
    file: string;
    description: string;
}) => {
    const { data, error } = await auth();
    if (error || !data) {
        return { error };
    }

    try {
        const video = await prisma.video.create({
            data: {
                title: name as string,
                url: file as string,
                description: description as string,
                userId: data.sub,
            },
        });
        return { data: video, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
};
