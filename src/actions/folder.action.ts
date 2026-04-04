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

export type FolderPickerOption = { id: string; label: string };

export type FolderMoveListItem = { id: string; name: string; depth: number };

/** Parent location label for a folder (“Library” if at root). */
export const getFolderParentLocationLabel = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: data.sub },
            select: { parentId: true },
        });
        if (!folder) {
            return { error: "Folder not found", data: null, status: 404 };
        }
        if (!folder.parentId) {
            return { error: null, data: "Library", status: 200 };
        }
        const parent = await prisma.folder.findFirst({
            where: { id: folder.parentId, userId: data.sub },
            select: { name: true },
        });
        return {
            error: null,
            data: parent?.name ?? "Library",
            status: 200,
        };
    } catch (error) {
        console.error("getFolderParentLocationLabel error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/** All descendants of `rootId` (not including `rootId`). */
async function collectDescendantFolderIds(
    userId: string,
    rootId: string
): Promise<Set<string>> {
    const out = new Set<string>();
    const queue = [rootId];
    while (queue.length) {
        const id = queue.shift()!;
        const children = await prisma.folder.findMany({
            where: { parentId: id, userId },
            select: { id: true },
        });
        for (const c of children) {
            out.add(c.id);
            queue.push(c.id);
        }
    }
    return out;
}

async function collectFolderPickerOptions(
    userId: string,
    parentId: string | null,
    depth: number,
    excludeIds: Set<string>
): Promise<FolderPickerOption[]> {
    const folders = await prisma.folder.findMany({
        where: { userId, parentId },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });
    const pad = "\u00A0".repeat(depth * 2);
    const out: FolderPickerOption[] = [];
    for (const f of folders) {
        if (excludeIds.has(f.id)) continue;
        out.push({ id: f.id, label: `${pad}${f.name}` });
        out.push(
            ...(await collectFolderPickerOptions(
                userId,
                f.id,
                depth + 1,
                excludeIds
            ))
        );
    }
    return out;
}

async function collectMoveListItems(
    userId: string,
    parentId: string | null,
    depth: number,
    excludeIds: Set<string>
): Promise<FolderMoveListItem[]> {
    const folders = await prisma.folder.findMany({
        where: { userId, parentId },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });
    const out: FolderMoveListItem[] = [];
    for (const f of folders) {
        if (excludeIds.has(f.id)) continue;
        out.push({ id: f.id, name: f.name, depth });
        out.push(
            ...(await collectMoveListItems(
                userId,
                f.id,
                depth + 1,
                excludeIds
            ))
        );
    }
    return out;
}

export const getFolderMoveListForVideo = async () => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const items = await collectMoveListItems(
            data.sub,
            null,
            0,
            new Set()
        );
        return { error: null, data: items, status: 200 };
    } catch (error) {
        console.error("getFolderMoveListForVideo error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const getFolderMoveListForFolderMove = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const exclude = new Set<string>([folderId]);
        const descendants = await collectDescendantFolderIds(
            data.sub,
            folderId
        );
        descendants.forEach((id) => exclude.add(id));
        const items = await collectMoveListItems(
            data.sub,
            null,
            0,
            exclude
        );
        return { error: null, data: items, status: 200 };
    } catch (error) {
        console.error("getFolderMoveListForFolderMove error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/** Flat tree for “move video” (every folder the user owns). */
export const getFolderPickerOptionsForVideoMove = async () => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const options = await collectFolderPickerOptions(
            data.sub,
            null,
            0,
            new Set()
        );
        return { error: null, data: options, status: 200 };
    } catch (error) {
        console.error("getFolderPickerOptionsForVideoMove error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/** Flat tree for “move folder”, excluding this folder and its subtree (no moving into self/descendant). */
export const getFolderPickerOptionsForFolderMove = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const exclude = new Set<string>([folderId]);
        const descendants = await collectDescendantFolderIds(data.sub, folderId);
        descendants.forEach((id) => exclude.add(id));
        const options = await collectFolderPickerOptions(
            data.sub,
            null,
            0,
            exclude
        );
        return { error: null, data: options, status: 200 };
    } catch (error) {
        console.error("getFolderPickerOptionsForFolderMove error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

/** Change parent folder. `newParentId: null` = library root. */
export const moveFolder = async (folderId: string, newParentId: string | null) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    if (newParentId === folderId) {
        return { error: "Cannot move a folder into itself", data: null, status: 400 };
    }
    try {
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId: data.sub },
            select: { id: true, parentId: true },
        });
        if (!folder) {
            return { error: "Folder not found", data: null, status: 404 };
        }

        if (newParentId) {
            const descendants = await collectDescendantFolderIds(
                data.sub,
                folderId
            );
            if (descendants.has(newParentId)) {
                return {
                    error: "Cannot move a folder into its own subfolder",
                    data: null,
                    status: 400,
                };
            }
            const parent = await prisma.folder.findFirst({
                where: { id: newParentId, userId: data.sub },
            });
            if (!parent) {
                return { error: "Destination folder not found", data: null, status: 404 };
            }
        }

        await prisma.folder.updateMany({
            where: { id: folderId, userId: data.sub },
            data: { parentId: newParentId },
        });

        revalidateFolderViews();
        revalidatePath(`/f/${folderId}`);
        return { error: null, data: { id: folderId }, status: 200 };
    } catch (error) {
        console.error("moveFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};
