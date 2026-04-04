"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
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
import { renameFolder, deleteFolder } from "@/actions/folder.action";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    folderId: string;
    folderName: string;
    /** If set, navigate here after delete (e.g. parent folder). Otherwise only refresh. */
    afterDeleteHref?: string;
    /** Compact trigger for header toolbar */
    variant?: "card" | "toolbar";
};

export default function FolderMoreMenu({
    folderId,
    folderName,
    afterDeleteHref,
    variant = "card",
}: Props) {
    const router = useRouter();
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [newName, setNewName] = useState(folderName);
    const [pending, startTransition] = useTransition();

    const runRename = () => {
        startTransition(async () => {
            const res = await renameFolder(folderId, newName);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            toast.success("Folder renamed");
            setRenameOpen(false);
            router.refresh();
        });
    };

    const runDelete = () => {
        startTransition(async () => {
            const res = await deleteFolder(folderId);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            toast.success("Folder deleted");
            setDeleteOpen(false);
            if (afterDeleteHref) {
                router.push(afterDeleteHref);
            } else {
                router.refresh();
            }
        });
    };

    const triggerClass =
        variant === "toolbar"
            ? "border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2";

    return (
        <>
            <DropDown>
                <DropDown.Trigger className={triggerClass}>
                    <button
                        type="button"
                        aria-label="Folder actions"
                        className="flex items-center justify-center gap-2"
                    >
                        {variant === "toolbar" ? (
                            <>
                                <span>Folder</span>
                                <BsThreeDots className="size-4" />
                            </>
                        ) : (
                            <BsThreeDots className="size-5" />
                        )}
                    </button>
                </DropDown.Trigger>
                <DropDown.Body align="right" className="!min-w-[9rem]">
                    <ul className="flex flex-col gap-0.5 text-sm font-medium">
                        <li>
                            <button
                                type="button"
                                className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-left"
                                onClick={() => {
                                    setNewName(folderName);
                                    setRenameOpen(true);
                                }}
                            >
                                <Pencil className="size-4" />
                                Rename
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 className="size-4" />
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
                    if (o) setNewName(folderName);
                }}
            >
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rename folder</DialogTitle>
                        <DialogDescription>
                            Update the name shown in your library.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <label
                            htmlFor={`rename-menu-${folderId}`}
                            className="text-sm font-medium"
                        >
                            Name
                        </label>
                        <input
                            id={`rename-menu-${folderId}`}
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRenameOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={pending || !newName.trim()}
                            onClick={runRename}
                        >
                            {pending ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="!rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete folder?</DialogTitle>
                        <DialogDescription>
                            Videos and subfolders inside &quot;{folderName}&quot; move up
                            one level (same parent as this folder). This folder will be
                            removed.
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
                            onClick={runDelete}
                        >
                            {pending ? "Deleting…" : "Delete folder"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
