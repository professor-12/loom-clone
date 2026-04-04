"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { moveVideoToFolderAction } from "@/actions/video.actions";
import type { FolderPickerOption } from "@/actions/folder.action";
import { PiDotsThreeBold } from "react-icons/pi";
import { toast } from "sonner";

type Props = {
    videoId: string;
    currentFolderId: string | null;
    folderPickerOptions: FolderPickerOption[];
};

export default function MoveVideoMenu({
    videoId,
    currentFolderId,
    folderPickerOptions,
}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<string>("__stay__");
    const [pending, startTransition] = useTransition();

    const openDialog = () => {
        setTargetId("__stay__");
        setOpen(true);
    };

    const handleMove = () => {
        startTransition(async () => {
            let folderId: string | null;
            if (targetId === "__stay__") {
                setOpen(false);
                return;
            }
            if (targetId === "__root__") {
                folderId = null;
            } else {
                folderId = targetId;
            }

            const sameAsCurrent =
                (folderId === null && currentFolderId === null) ||
                folderId === currentFolderId;
            if (sameAsCurrent) {
                toast.message("Already in that location");
                setOpen(false);
                return;
            }

            const res = await moveVideoToFolderAction({ videoId, folderId });
            if (!res.ok) {
                toast.error(
                    res.error === "UNAUTHORIZED"
                        ? "Sign in required"
                        : "Could not move video"
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
                    openDialog();
                }}
            >
                <PiDotsThreeBold className="size-5" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Move video</DialogTitle>
                        <DialogDescription>
                            Choose a folder or the library root.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <label
                            htmlFor="move-video-folder"
                            className="text-sm font-medium"
                        >
                            Location
                        </label>
                        <select
                            id="move-video-folder"
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                        >
                            <option value="__stay__">Select location…</option>
                            <option value="__root__">Library root</option>
                            {folderPickerOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={pending || targetId === "__stay__"}
                            onClick={handleMove}
                        >
                            {pending ? "Moving…" : "Move"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
