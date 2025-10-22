import { getVideos } from "@/actions/video.actions";
import { Button } from "@/components/ui/button";
import { Video as _Video } from "@prisma/client";
import { Suspense } from "react";
import VideoSkeletons from "./VideoSkeletons";
import { VideoCard } from "./VideoCard";

const Video = async () => {
    return (
        <div className="pb-12">
            {/* <Folders /> */}
            <div className="flex justify-between">
                <h1 className="font-bold text-lg">Videos</h1>
                <div className="flex items-center gap-3">
                    <Button
                        variant={"outline"}
                        className="rounded-lg font-semibold text-black/99 text-xs"
                    >
                        Upload Date
                    </Button>
                    <Button
                        variant={"outline"}
                        className="rounded-lg font-semibold text-black/90 text-xs"
                    >
                        Newest to Oldest
                    </Button>
                </div>
            </div>
            <Suspense fallback={<VideoSkeletons />}>
                <VideoContainer></VideoContainer>
            </Suspense>
        </div>
    );
};

export default Video;

export const VideoContainer = async () => {
    const { data } = await getVideos({ limit: 100, page: 1 });
    if (data?.length == 0) {
        return (
            <div className="flex-center flex-col font-bold gap-3">
                <svg
                    width="600"
                    height="250"
                    className="animate-pulse"
                    viewBox="0 0 200 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="70"
                        y="30"
                        width="100"
                        height="50"
                        rx="8"
                        fill="#E9ECEF"
                    />
                    <rect
                        x="40"
                        y="60"
                        width="100"
                        height="50"
                        rx="8"
                        fill="#F8F9FA"
                    />
                    <rect
                        x="55"
                        y="75"
                        width="50"
                        height="6"
                        rx="3"
                        fill="#CED4DA"
                    />
                    <rect
                        x="55"
                        y="87"
                        width="70"
                        height="6"
                        rx="3"
                        fill="#CED4DA"
                    />
                    <rect
                        x="85"
                        y="45"
                        width="50"
                        height="6"
                        rx="3"
                        fill="#DEE2E6"
                    />

                    <circle cx="30" cy="90" r="3" fill="#DEE2E6" />
                    <circle cx="170" cy="35" r="3" fill="#DEE2E6" />
                    <circle cx="150" cy="95" r="2" fill="#DEE2E6" />
                    <circle cx="60" cy="40" r="2" fill="#DEE2E6" />
                    <path
                        d="M30 50h2v2h-2zM168 70h2v2h-2zM120 20h2v2h-2zM90 105h2v2h-2z"
                        fill="#E9ECEF"
                    />
                </svg>
                <div>No Videos</div>
            </div>
        );
    }
    return (
        <div className="grid py-12 gap-4 xl:grid-cols-4  sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
            {data?.map((video) => (
                <VideoCard {...video} key={video.id} />
            ))}
        </div>
    );
};
