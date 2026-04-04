"use server";
import { auth } from "./auth.actions";
import { prisma } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

function revalidateFolderViews() {
    revalidatePath("/library", "layout");
}

export const createFolderAction = async (parentId?: string | null) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        if (parentId) {
            const parent = await prisma.folder.findFirst({
                where: { id: parentId, userId: data.sub },
            });
            if (!parent) {
                return {
                    error: "Parent folder not found",
                    data: null,
                    status: 404,
                };
            }
        }
        const folder = await prisma.folder.create({
            data: {
                name: "Untitled Folder",
                userId: data.sub,
                parentId: parentId ?? null,
            },
        });
        revalidateFolderViews();
        return { error: null, data: folder, status: 200 };
    } catch (error) {
        console.log("createFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const renameFolder = async (folderId: string, name: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    const trimmed = name.trim();
    if (!trimmed) {
        return { error: "Folder name is required", data: null, status: 400 };
    }
    try {
        const updated = await prisma.folder.updateMany({
            where: { id: folderId, userId: data.sub },
            data: { name: trimmed },
        });
        if (updated.count === 0) {
            return { error: "Folder not found", data: null, status: 404 };
        }
        revalidateFolderViews();
        revalidatePath(`/f/${folderId}`);
        return { error: null, data: { id: folderId, name: trimmed }, status: 200 };
    } catch (error) {
        console.error("renameFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/** Removes the folder and moves its videos and subfolders up to the parent (or library root). */
export const deleteFolder = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: data.sub },
            select: { id: true, parentId: true },
        });
        if (!folder) {
            return { error: "Folder not found", data: null, status: 404 };
        }

        const newParentId = folder.parentId;

        await prisma.$transaction([
            prisma.video.updateMany({
                where: { folderId },
                data: { folderId: newParentId },
            }),
            prisma.folder.updateMany({
                where: { parentId: folderId, userId: data.sub },
                data: { parentId: newParentId },
            }),
            prisma.folder.deleteMany({
                where: { id: folderId, userId: data.sub },
            }),
        ]);

        revalidateFolderViews();
        revalidatePath(`/f/${folderId}`);
        return { error: null, data: { id: folderId }, status: 200 };
    } catch (error) {
        console.error("deleteFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const assertFolderAccess = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId, userId: data.sub },
        });
        if (!folder) {
            return { error: "Folder not found", data: null, status: 404 };
        }
        return { error: null, data: folder, status: 200 };
    } catch (error) {
        console.error("assertFolderAccess error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export type FolderBreadcrumbSegment = { id: string; name: string };

/** Ancestor chain from library root → current folder (inclusive). Each segment links to `/f/[id]`. */
export const getFolderBreadcrumb = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const chain: FolderBreadcrumbSegment[] = [];
        let currentId: string | null = folderId;
        const maxDepth = 64;

        for (let depth = 0; depth < maxDepth && currentId; depth++) {
            const row: {
                id: string;
                name: string;
                parentId: string | null;
            } | null = await prisma.folder.findFirst({
                where: { id: currentId, userId: data.sub },
                select: { id: true, name: true, parentId: true },
            });
            if (!row) {
                return { error: "Folder not found", data: null, status: 404 };
            }
            chain.unshift({ id: row.id, name: row.name });
            currentId = row.parentId;
        }

        return { error: null, data: chain, status: 200 };
    } catch (error) {
        console.error("getFolderBreadcrumb error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/**
 * @param opts - Omit or `{}` = all folders for the user. Pass `{ parentId }` to filter:
 * `parentId: string` = direct children of that folder; `parentId: null` = root folders only.
 */
export const getFolders = async (opts?: { parentId?: string | null }) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: [], status: 401 };
    }
    try {
        const where: Prisma.FolderWhereInput = { userId: data.sub };
        if (opts !== undefined && Object.prototype.hasOwnProperty.call(opts, "parentId")) {
            where.parentId = opts.parentId ?? null;
        }
        const folders = await prisma.folder.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { videos: true },
        });
        return { error: null, data: folders, status: 200 };
    } catch (error) {
        console.error("getFolders error:", error);
        return { error: "Internal server error", data: [], status: 500 };
    }
};
