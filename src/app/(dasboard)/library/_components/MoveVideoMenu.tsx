"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { moveVideoToFolder } from "@/actions/video.actions";
import {
    createFolderAction,
    getFolderMoveListForVideo,
} from "@/actions/folder.action";
import type { FolderMoveListItem } from "@/actions/folder.action";
import { toast } from "sonner";
import { FolderInput } from "lucide-react";
import MoveWithinLibraryModal, {
    type MoveDestination,
} from "./MoveWithinLibraryModal";

type Props = {
    videoId: string;
    currentFolderId: string | null;
    /** e.g. folder name or "Library" */
    currentlyInLabel: string;
};

export default function MoveVideoMenu({
    videoId,
    currentFolderId,
    currentlyInLabel,
}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [folders, setFolders] = useState<FolderMoveListItem[]>([]);
    const [foldersLoading, setFoldersLoading] = useState(false);
    const [listKey, setListKey] = useState(0);
    const [selected, setSelected] = useState<MoveDestination>("pick");
    const [movePending, startMove] = useTransition();
    const [createPending, startCreate] = useTransition();

    useEffect(() => {
        if (!open) {
            setFoldersLoading(false);
            return;
        }
        let cancelled = false;
        setFoldersLoading(true);
        (async () => {
            try {
                const res = await getFolderMoveListForVideo();
                if (!cancelled && res.error === null && res.data) {
                    setFolders(res.data);
                }
            } finally {
                if (!cancelled) setFoldersLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [open, listKey]);

    const openModal = () => {
        setSelected("pick");
        setOpen(true);
    };

    const parentForNewFolder = (): string | null => {
        if (selected === "pick" || selected === "root") return null;
        return selected;
    };

    const handleCreateFolder = () => {
        startCreate(async () => {
            const res = await createFolderAction(parentForNewFolder());
            if (res.error) {
                if (res.status === 401) toast.error("Unauthorized");
                else toast.error("Could not create folder");
                return;
            }
            toast.success("Folder created");
            setListKey((k) => k + 1);
            router.refresh();
        });
    };

    const handleMove = () => {
        if (selected === "pick") return;
        const newFolderId = selected === "root" ? null : selected;
        const unchanged =
            (newFolderId === null && currentFolderId === null) ||
            newFolderId === currentFolderId;
        if (unchanged) {
            toast.message("Video is already in that location");
            setOpen(false);
            return;
        }

        startMove(async () => {
            const res = await moveVideoToFolder(videoId, newFolderId);
            if (res.error) {
                toast.error(
                    res.error === "UNAUTHORIZED"
                        ? "Sign in required"
                        : res.error
                );
                return;
            }
            toast.success("Video moved");
            setOpen(false);
            router.refresh();
        });
    };

    return (
        <>
            <button
                type="button"
                className="cursor-pointer rounded-md bg-white p-1"
                aria-label="Move video"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal();
                }}
            >
                <FolderInput className="size-5" />
            </button>

            <MoveWithinLibraryModal
                open={open}
                onOpenChange={setOpen}
                currentlyInLabel={currentlyInLabel}
                folders={folders}
                selected={selected}
                onSelect={setSelected}
                onMove={handleMove}
                onCreateFolder={handleCreateFolder}
                pendingMove={movePending}
                pendingCreate={createPending}
                foldersLoading={foldersLoading}
            />
        </>
    );
}
