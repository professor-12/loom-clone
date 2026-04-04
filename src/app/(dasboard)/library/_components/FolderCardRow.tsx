"use client";

import Link from "next/link";
import { FaRegFolderClosed } from "react-icons/fa6";
import FolderMoreMenu from "./FolderMoreMenu";

type Props = {
    id: string;
    name: string;
    videoCount: number;
};

export default function FolderCardRow({ id, name, videoCount }: Props) {
    const videoLabel =
        videoCount === 1 ? "1 video" : `${videoCount} videos`;

    return (
        <div className="border-border hover:ring-primary/40 focus-within:ring-primary/30 flex items-stretch rounded-2xl border ring-2 ring-transparent transition-all hover:ring-2">
            <Link
                href={`/f/${id}`}
                className="focus-visible:ring-ring flex min-w-0 flex-1 items-center gap-2 p-4 px-5 focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none"
            >
                <FaRegFolderClosed className="shrink-0" />
                <div className="min-w-0">
                    <h3 className="truncate font-bold">{name}</h3>
                    <p className="text-muted-foreground text-sm">{videoLabel}</p>
                </div>
            </Link>
            <div className="flex shrink-0 items-center pr-2">
                <FolderMoreMenu folderId={id} folderName={name} variant="card" />
            </div>
        </div>
    );
}
