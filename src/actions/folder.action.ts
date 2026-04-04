import { auth } from "./auth.actions";
import { prisma } from "@/lib/utils";

export const createFolder = async (name: string, parentId?: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.create({
            data: {
                name,
                userId: data.sub,
                parentId: parentId,
            },
        });
        return { error: null, data: folder, status: 200 };
    } catch (error) {
        console.error("createFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const renameFolder = async (folderId: string, name: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.update({
            where: { id: folderId, userId: data.sub },
            data: { name },
        });
        return { error: null, data: folder, status: 200 };
    } catch (error) {
        console.error("renameFolder error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const deleteFolder = async (folderId: string) => {
    const { data } = await auth();
    if (!data) {
        return { error: "Unauthorized", data: null, status: 401 };
    }
    try {
        const folder = await prisma.folder.delete({
            where: { id: folderId, userId: data.sub },
        });
        return { error: null, data: folder, status: 200 };
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

export const getFolderBreadcrumb = async (folderId: string) => {
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
        const breadcrumb = await prisma.folder.findMany({
            where: {
                parentId: { in: folderId ? [folderId] : ([] as string[]) },
                userId: data.sub as string,
            },
            orderBy: { createdAt: "desc" },
        });
        return { error: null, data: breadcrumb, status: 200 };
    } catch (error) {
        console.error("getFolderBreadcrumb error:", error);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export const getFolders = async ({ parentId }: { parentId?: string }) => {
      const { data } = await auth();
      if (!data) {
        return { error: "Unauthorized", data: [], status: 401 };
      }
      try {
        const folders = await prisma.folder.findMany({
            where: { userId: data.sub, parentId: parentId ?? undefined },
            orderBy: { createdAt: "desc" },
            include: { videos: true },
        });
        return { error: null, data: folders, status: 200 };
      } catch (error) {
        console.error("getFolders error:", error);
        return { error: "Internal server error", data: [], status: 500 };
      }
}