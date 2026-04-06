import { getVideo } from "@/actions/video.actions";
import React from "react";
import HeaderDetail from "../header";
import VideoPlayer from "../components/VideoPlayer";
import VideoTranscriptPanel from "../components/VideoTranscriptPanel";
import { getActiveShareLinkIdByVideoId } from "@/actions/share.actions";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const { data } = (await getVideo(id)) as any;
    return {
        title: data.title,
        description: data.description,
        image: data.thumbnailUrl ?? undefined,
    };
}
const Share = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const active = await getActiveShareLinkIdByVideoId(id);
    if (active.data) {
        redirect(`/s/${active.data}`);
    }
    const { data } = await getVideo(id);

    return (
        <div>
            <div>
                <HeaderDetail data={data as any} />
                <main className="flex max-lg:flex-col p-6 lg:items-start">
                    <div className="md:flex-[2] lg:flex-[2.5] md:px-24 lg:h-fit">
                        <VideoPlayer
                            src={data!.url}
                            poster={data!.thumbnailUrl ?? undefined}
                        />
                    </div>
                    <div className="flex w-full min-w-0 flex-1 lg:max-w-md lg:sticky lg:top-6 lg:h-fit">
                        <VideoTranscriptPanel
                            videoId={data!.id}
                            initialStatus={data!.transcriptStatus}
                            initialTranscript={data!.transcript}
                            initialError={data!.transcriptError}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Share;
