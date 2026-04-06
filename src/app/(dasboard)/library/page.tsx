import React, { Suspense } from "react";
import Header from "./_components/header";
import { Metadata } from "next";
import Tab from "./_components/tab";
import Video from "./_components/Video";
import Folders from "./_components/Folders";
import { getFolders } from "@/actions/folder.action";
import { getVideos } from "@/actions/video.actions";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Video | Library | Loop",
};

const FOLDERS_PREVIEW = 4;

type PageProps = {
    searchParams: Promise<{ tab?: string }>;
};

const Page = async ({ searchParams }: PageProps) => {
    const { tab } = await searchParams;
    const foldersExpanded = tab === "folders";

    return (
        <div className="pt-15">
            <div className="space-y-12">
                <Header />
                <div className="flex w-full justify-between border-b">
                    <Tab />
                    <Suspense
                        fallback={
                            <p className="text-muted-foreground/60 text-sm font-medium">
                                …
                            </p>
                        }
                    >
                        <VideoCount />
                    </Suspense>
                </div>
                <Suspense fallback={<FoldersSkeleton />}>
                    <SuspenseFolders expanded={foldersExpanded} />
                </Suspense>

                <div>
                    <Video />
                </div>
            </div>
        </div>
    );
};

export default Page;

async function VideoCount() {
    const res = await getVideos({ limit: 1, page: 1 });
    const total = res.error === null ? res.total : 0;
    return (
        <div className="text-muted-foreground/60 text-sm font-medium">
            <p>{total} videos</p>
        </div>
    );
}

async function SuspenseFolders({ expanded }: { expanded: boolean }) {
    const folders = await getFolders({});
    const all = folders.error === null ? folders.data : [];
    const totalCount = all.length;
    const display = expanded ? all : all.slice(0, FOLDERS_PREVIEW);

    return (
        <Folders
            folders={display}
            totalFolderCount={totalCount}
            expanded={expanded}
        />
    );
}

function FoldersSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-9 w-28" />
            </div>
            <div className="grid w-full grid-cols-1 gap-3 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </div>
    );
}
