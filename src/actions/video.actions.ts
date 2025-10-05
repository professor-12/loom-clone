"use server";

import { prisma } from "@/lib/utils";
import { auth } from "./auth.actions";

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
    const { data } = await auth();
    if (!data) {
        return { error: "UNAUTHORIZED", data: null };
    }
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
