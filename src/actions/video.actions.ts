"use server";

import { prisma } from "@/lib/utils";
import { auth } from "./auth.actions";
import { error } from "console";
import { revalidatePath } from "next/cache";

interface Pagination {
    page?: number;
    limit?: number;
}
export const getVideos = async ({ page = 1, limit = 10 }: Pagination) => {
    const { data } = await auth();
    if (!data) {
        return { error: "UNAUTHORIZED", data: null };
    }

    const [userVideos, total] = await Promise.all([
        prisma.video.findMany({
            where: { userId: data.sub },
            include: { user: true },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: limit * (page - 1),
        }),
        prisma.video.count({ where: { userId: data.sub } }),
    ]);

    return { data: userVideos, total, error: null };
};

export const getVideo = async (id: string) => {
    const userVideo = await prisma.video.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });

    return { data: userVideo, error: null };
};

export const deleteVideo = async (id: string) => {
    try {
        const { data } = await auth();
        if (!data) {
            return { error: "UNAUTHORIZED", data: null, status: 401 };
        }

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video || video.userId !== data.sub) {
            return {
                error: "Video not found or unauthorized",
                data: null,
                status: 404,
            };
        }

        await prisma.video.delete({ where: { id } });

        revalidatePath("/library");
        return { data: "Video deleted successfully", error: null, status: 200 };
    } catch (err: any) {
        console.error(err);
        return { data: null, error: "Something went wrong", status: 500 };
    }
};
