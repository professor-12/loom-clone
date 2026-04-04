"use server";

import { prisma } from "@/lib/utils";
import { auth } from "./auth.actions";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

interface Pagination {
    page?: number;
    limit?: number;
    folderId?: string;
}
export const getVideos = async ({ page = 1, limit = 10, folderId }: Pagination) => {
    const { data } = await auth();
    if (!data) {
        return { error: "UNAUTHORIZED", data: null };
    }

    const where: Prisma.VideoWhereInput = { userId: data.sub };
    if (folderId !== undefined) {
        where.folderId = folderId;
    }

    const [userVideos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            include: { user: true },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: limit * (page - 1),
        }),
        prisma.video.count({ where }),
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
