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
import DropDown from "@/components/ui/drop-down";
import {
    renameFolderAction,
    deleteFolderAction,
    moveFolderAction,
    type FolderPickerOption,
} from "@/actions/folder.action";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";
import { FolderInput } from "./FolderInput";

type Props = {
    folderId: string;
    folderName: string;
    moveOptions: FolderPickerOption[];
};

export default function FolderActionsMenu({
    folderId,
    folderName,
    moveOptions,
}: Props) {
    const router = useRouter();
    const [renameOpen, setRenameOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [name, setName] = useState(folderName);
    const [targetParentId, setTargetParentId] = useState<string>("");
    const [pending, startTransition] = useTransition();

    const openRename = () => {
        setName(folderName);
        setRenameOpen(true);
    };

    const handleRename = () => {
        startTransition(async () => {
            const res = await renameFolderAction({ folderId, name });
            if (!res.ok) {
                toast.error(res.error ?? "Could not rename folder");
                return;
            }
            toast.success("Folder renamed");
            setRenameOpen(false);
            router.refresh();
        });
    };

    const handleMove = () => {
        startTransition(async () => {
            const newParentId =
                targetParentId.length === 0 ? null : targetParentId;
            const res = await moveFolderAction({
                folderId,
                newParentId,
            });
            if (!res.ok) {
                toast.error(res.error ?? "Could not move folder");
                return;
            }
            toast.success("Folder moved");
            setMoveOpen(false);
            router.refresh();
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteFolderAction(folderId);
            if (!res.ok) {
                toast.error(res.error ?? "Could not delete folder");
                return;
            }
            toast.success("Folder deleted");
            setDeleteOpen(false);
            router.refresh();
        });
    };

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <DropDown>
                <DropDown.Trigger className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <button
                        type="button"
                        aria-label="Folder actions"
                        className="flex items-center justify-center"
                    >
                        <BsThreeDots className="size-5" />
                    </button>
                </DropDown.Trigger>
                <DropDown.Body align="right" className="!min-w-[10rem]">
                    <ul className="flex flex-col gap-0.5 font-medium text-sm">
                        <li>
                            <button
                                type="button"
                                className="hover:bg-muted w-full rounded-md px-3 py-2 text-left"
                                onClick={openRename}
                            >
                                Rename
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="hover:bg-muted w-full rounded-md px-3 py-2 text-left"
                                onClick={() => {
                                    setTargetParentId("");
                                    setMoveOpen(true);
                                }}
                            >
                                Move to…
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="hover:bg-destructive/10 text-destructive w-full rounded-md px-3 py-2 text-left"
                                onClick={() => setDeleteOpen(true)}
                            >
                                Delete
                            </button>
                        </li>
                    </ul>
                </DropDown.Body>
            </DropDown>

            <Dialog
                open={renameOpen}
                onOpenChange={(o) => {
                    setRenameOpen(o);
                    if (o) setName(folderName);
                }}
            >
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rename folder</DialogTitle>
                        <DialogDescription>
                            Choose a name for this folder.
                        </DialogDescription>
                    </DialogHeader>
                    <FolderInput
                        value={name}
                        onChange={setName}
                        label="Folder name"
                        id="rename-folder"
                    />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRenameOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={pending || !name.trim()}
                            onClick={handleRename}
                        >
                            {pending ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Move folder</DialogTitle>
                        <DialogDescription>
                            Move this folder into another folder, or to the
                            library root.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <label
                            htmlFor="move-folder-parent"
                            className="text-sm font-medium"
                        >
                            Location
                        </label>
                        <select
                            id="move-folder-parent"
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                            value={targetParentId}
                            onChange={(e) => setTargetParentId(e.target.value)}
                        >
                            <option value="">Library root</option>
                            {moveOptions.map((opt) => (
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
                            onClick={() => setMoveOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={pending}
                            onClick={handleMove}
                        >
                            {pending ? "Moving…" : "Move"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete folder?</DialogTitle>
                        <DialogDescription>
                            Videos and subfolders inside will move up one level
                            (same location as this folder&apos;s parent). The
                            folder itself will be removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={pending}
                            onClick={handleDelete}
                        >
                            {pending ? "Deleting…" : "Delete folder"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
