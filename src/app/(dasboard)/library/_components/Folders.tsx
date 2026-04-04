import React from "react";
import { Folder, Video } from "@prisma/client";
import { ShowMoreButton } from "./ui/ShowMoreButton";
import FolderCardRow from "./FolderCardRow";

const FOLDERS_PREVIEW = 4;

type Props = {
    folders: (Folder & { videos: Video[] })[];
    totalFolderCount: number;
    expanded: boolean;
    /** Library home uses show-more; folder detail sets false. */
    showMoreButton?: boolean;
    sectionTitle?: string;
};

const Folders = ({
    folders,
    totalFolderCount,
    expanded,
    showMoreButton = true,
    sectionTitle = "Folders",
}: Props) => {
    if (!showMoreButton) {
        if (!folders.length) {
            return null;
        }
        return (
            <section className="space-y-4" aria-label={sectionTitle}>
                <h2 className="text-lg font-bold">{sectionTitle}</h2>
                <FolderContainer folders={folders} />
            </section>
        );
    }

    if (!expanded && (!folders || folders.length === 0)) {
        return null;
    }

    if (expanded && folders.length === 0) {
        return (
            <section className="space-y-4" aria-label="Folders">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{sectionTitle}</h2>
                    <ShowMoreButton
                        expanded
                        totalFolderCount={totalFolderCount}
                        previewLimit={FOLDERS_PREVIEW}
                    />
                </div>
                <p className="text-muted-foreground text-sm">
                    No folders yet. Create one from the header.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-4" aria-label="Folders">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">{sectionTitle}</h2>
                <ShowMoreButton
                    expanded={expanded}
                    totalFolderCount={totalFolderCount}
                    previewLimit={FOLDERS_PREVIEW}
                />
            </div>
            <FolderContainer folders={folders} />
        </section>
    );
};

export default Folders;

const FolderContainer = ({ folders }: { folders: Props["folders"] }) => {
    return (
        <div className="grid w-full grid-cols-1 gap-3 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {folders.map((folder) => (
                <FolderCardRow
                    key={folder.id}
                    id={folder.id}
                    name={folder.name}
                    videoCount={folder.videos.length}
                />
            ))}
        </div>
    );
};
