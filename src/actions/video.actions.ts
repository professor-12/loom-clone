"use server";

import { prisma } from "@/lib/utils";
import { auth } from "./auth.actions";
import { revalidatePath } from "next/cache";
import type { Prisma, Visibility } from "@prisma/client";

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
            include: {
                user: true,
                folder: { select: { id: true, name: true } },
            },
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

/** Poll-friendly payload for the video transcript UI (share page). */
export const getVideoTranscriptSnapshot = async (videoId: string) => {
    try {
        const row = await prisma.video.findUnique({
            where: { id: videoId },
            select: {
                transcriptStatus: true,
                transcript: true,
                transcriptError: true,
            },
        });
        return { data: row, error: null as string | null };
    } catch {
        return { data: null, error: "Failed to load transcript" };
    }
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

        revalidatePath("/library", "layout");
        return { data: "Video deleted successfully", error: null, status: 200 };
    } catch (err: any) {
        console.error(err);
        return { data: null, error: "Something went wrong", status: 500 };
    }
};

/** `folderId: null` moves the video to library root (no folder). */
export const moveVideoToFolder = async (
    videoId: string,
    folderId: string | null
) => {
    const { data } = await auth();
    if (!data?.sub) {
        return { error: "UNAUTHORIZED", data: null, status: 401 };
    }
    try {
        const video = await prisma.video.findFirst({
            where: { id: videoId, userId: data.sub },
            select: { id: true, folderId: true },
        });
        if (!video) {
            return {
                error: "Video not found",
                data: null,
                status: 404,
            };
        }

        if (folderId) {
            const folder = await prisma.folder.findFirst({
                where: { id: folderId, userId: data.sub },
            });
            if (!folder) {
                return {
                    error: "Folder not found",
                    data: null,
                    status: 404,
                };
            }
        }

        await prisma.video.updateMany({
            where: { id: videoId, userId: data.sub },
            data: { folderId },
        });

        revalidatePath("/library", "layout");
        if (video.folderId) {
            revalidatePath(`/f/${video.folderId}`);
        }
        if (folderId) {
            revalidatePath(`/f/${folderId}`);
        }

        return { error: null, data: { id: videoId }, status: 200 };
    } catch (err) {
        console.error(err);
        return { data: null, error: "Something went wrong", status: 500 };
    }
};

export const updateVideoVisibility = async (
    videoId: string,
    visibility: Visibility
) => {
    const { data } = await auth();
    if (!data?.sub) {
        return { error: "UNAUTHORIZED", data: null as any, status: 401 };
    }

    const video = await prisma.video.findFirst({
        where: { id: videoId, userId: data.sub },
        select: { id: true },
    });
    if (!video) {
        return { error: "NOT_FOUND", data: null as any, status: 404 };
    }

    await prisma.video.update({
        where: { id: videoId },
        data: { visibility },
        select: { id: true },
    });

    revalidatePath("/library", "layout");
    return { error: null, data: { id: videoId }, status: 200 };
};
