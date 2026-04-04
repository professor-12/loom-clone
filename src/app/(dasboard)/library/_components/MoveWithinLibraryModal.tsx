"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FolderMoveListItem } from "@/actions/folder.action";
import { Folder, Library, Plus } from "lucide-react";

export type MoveDestination = "pick" | "root" | string;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Shown under “Currently in:” */
    currentlyInLabel: string;
    folders: FolderMoveListItem[];
    selected: MoveDestination;
    onSelect: (dest: MoveDestination) => void;
    onMove: () => void;
    /** Creates a folder; parent = selected folder, or library root if Library/none picked. */
    onCreateFolder: () => void;
    pendingMove: boolean;
    pendingCreate: boolean;
    /** While folder list is loading from the server */
    foldersLoading?: boolean;
};

export default function MoveWithinLibraryModal({
    open,
    onOpenChange,
    currentlyInLabel,
    folders,
    selected,
    onSelect,
    onMove,
    onCreateFolder,
    pendingMove,
    pendingCreate,
    foldersLoading = false,
}: Props) {
    const moveEnabled = selected !== "pick";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton
                className="!flex max-h-[min(560px,90vh)] !w-full !max-w-lg flex-col !gap-0 overflow-hidden !rounded-2xl !p-0 sm:!max-w-lg"
            >
                <DialogHeader className="border-border shrink-0 border-b px-6 py-4 pr-10 text-left">
                    <DialogTitle className="text-lg font-semibold">
                        Move within Library
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
                    <div>
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            Currently in:
                        </p>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Library className="size-4 shrink-0 opacity-70" />
                            <span>{currentlyInLabel}</span>
                        </div>
                    </div>

                    <div className="border-border border-t pt-2">
                        <p className="mb-2 text-xs font-medium tracking-wide text-foreground uppercase">
                            Move to:
                        </p>
                        <div
                            className="border-border max-h-[min(240px,42vh)] overflow-y-auto rounded-lg border"
                            aria-busy={foldersLoading}
                        >
                            <button
                                type="button"
                                disabled={pendingCreate}
                                onClick={() => onCreateFolder()}
                                className="hover:bg-muted flex w-full items-center gap-2 border-b px-3 py-2.5 text-left text-sm font-medium disabled:opacity-50"
                            >
                                <Plus className="size-4 shrink-0" />
                                New folder
                            </button>
                            <button
                                type="button"
                                onClick={() => onSelect("root")}
                                className={cn(
                                    "flex w-full items-center gap-2 border-b px-3 py-2.5 text-left text-sm",
                                    "hover:bg-muted",
                                    selected === "root" && "bg-muted",
                                    foldersLoading && "border-b"
                                )}
                            >
                                <Library className="text-muted-foreground size-4 shrink-0" />
                                Library
                            </button>
                            {foldersLoading ? (
                                <div
                                    className="space-y-0"
                                    role="status"
                                    aria-label="Loading folders"
                                >
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="border-border flex items-center gap-2 border-b px-3 py-2.5 last:border-b-0"
                                            style={{
                                                paddingLeft: 12 + (i % 4) * 12,
                                            }}
                                        >
                                            <Skeleton className="size-4 shrink-0 rounded-sm" />
                                            <Skeleton
                                                className={cn(
                                                    "h-4 min-w-0",
                                                    i % 4 === 0 && "w-[42%]",
                                                    i % 4 === 1 && "w-[58%]",
                                                    i % 4 === 2 && "w-[72%]",
                                                    i % 4 === 3 && "w-[50%]"
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                folders.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => onSelect(item.id)}
                                        className={cn(
                                            "hover:bg-muted flex w-full items-center gap-2 border-b px-3 py-2.5 text-left text-sm last:border-b-0",
                                            selected === item.id && "bg-muted"
                                        )}
                                        style={{
                                            paddingLeft:
                                                12 +
                                                Math.min(item.depth, 8) * 14,
                                        }}
                                    >
                                        <Folder className="text-muted-foreground size-4 shrink-0" />
                                        <span className="truncate">
                                            {item.name}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-border shrink-0 flex-col gap-3 border-t bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full font-semibold sm:w-auto"
                        disabled={pendingCreate}
                        onClick={() => onCreateFolder()}
                    >
                        <Plus className="mr-2 size-4" />
                        New Folder
                    </Button>
                    <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 font-semibold sm:flex-none"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex-1 font-semibold sm:flex-none"
                            disabled={!moveEnabled || pendingMove}
                            onClick={onMove}
                        >
                            {pendingMove ? "Moving…" : "Move"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
