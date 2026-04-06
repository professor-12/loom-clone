import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NewVideoButton from "./NewVideoButton";
import NewFolderButton from "./NewFolderButton";
import FolderMoreMenu from "./FolderMoreMenu";
import type { FolderBreadcrumbSegment } from "@/actions/folder.action";

type Props = {
    /** Root → … → current folder. When set, header is in folder context. */
    folderBreadcrumb?: FolderBreadcrumbSegment[] | null;
};

const Header = ({ folderBreadcrumb = null }: Props) => {
    const segments = folderBreadcrumb?.length ? folderBreadcrumb : null;
    const activeFolderId = segments?.length
        ? segments[segments.length - 1]!.id
        : null;
    const title = segments?.length
        ? segments[segments.length - 1]!.name
        : "Videos";
    const afterDeleteHref =
        segments && segments.length > 1
            ? `/f/${segments[segments.length - 2]!.id}`
            : "/library";

    return (
        <div className="flex w-full items-end justify-between gap-4">
            <div className="min-w-0 space-y-1">
                {segments ? (
                    <nav
                        aria-label="Breadcrumb"
                        className="text-muted-foreground flex max-w-full flex-wrap items-center gap-x-1 gap-y-1 text-sm font-medium"
                    >
                        <Link
                            href="/library"
                            className="hover:text-foreground shrink-0 hover:underline"
                        >
                            Library
                        </Link>
                        {segments.map((seg, index) => {
                            const isLast = index === segments.length - 1;
                            return (
                                <span
                                    key={seg.id}
                                    className="flex min-w-0 items-center gap-1"
                                >
                                    <ChevronRight
                                        className="size-3.5 shrink-0 opacity-50"
                                        aria-hidden
                                    />
                                    {isLast ? (
                                        <span
                                            className="text-foreground truncate"
                                            aria-current="page"
                                        >
                                            {seg.name}
                                        </span>
                                    ) : (
                                        <Link
                                            href={`/f/${seg.id}`}
                                            className="hover:text-foreground max-w-[12rem] truncate hover:underline sm:max-w-xs"
                                        >
                                            {seg.name}
                                        </Link>
                                    )}
                                </span>
                            );
                        })}
                    </nav>
                ) : (
                    <h1 className="text-muted-foreground font-extrabold">
                        My library
                    </h1>
                )}
                <h2 className="truncate text-3xl font-black tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 font-bold">
                {segments && activeFolderId ? (
                    <FolderMoreMenu
                        folderId={activeFolderId}
                        folderName={title}
                        afterDeleteHref={afterDeleteHref}
                        variant="toolbar"
                    />
                ) : null}
                <NewFolderButton folderId={activeFolderId} />
                <NewVideoButton folderId={activeFolderId} />
            </div>
        </div>
    );
};

export default Header;
