"use server";

import { prisma } from "@/lib/utils";
import { auth } from "./auth.actions";

export const getVideos = async () => {
    const { data } = await auth();
    if (!data) {
        return { error: "UNAUTHORIZED", data: null };
    }
    const userVideos = await prisma.video.findMany({
        where: {
            userId: data.sub,
        },
        include: {
            user: true,
        },
    });

    return { data: userVideos, error: null };
};
