import { getShareVideo } from "@/actions/share.actions";
import HeaderDetail from "@/app/share/header";
import VideoPlayer from "@/app/share/components/VideoPlayer";
import VideoTranscriptPanel from "@/app/share/components/VideoTranscriptPanel";
import SharePasswordGate from "../components/SharePasswordGate";
import RequestAccessGate from "../components/RequestAccessGate";

type Props = {
    params: Promise<{ shareId: string }>;
};

export default async function SmartSharePage({ params }: Props) {
    const { shareId } = await params;
    const res = await getShareVideo(shareId);

    if (res.status === "NOT_FOUND") {
        return (
            <div className="p-10">
                <h1 className="text-xl font-semibold">Link not found</h1>
            </div>
        );
    }

    if (res.status === "REVOKED") {
        return (
            <div className="p-10">
                <h1 className="text-xl font-semibold">Link revoked</h1>
                <p className="text-muted-foreground mt-2">
                    This share link has been turned off.
                </p>
            </div>
        );
    }

    if (res.status === "EXPIRED") {
        return (
            <div className="p-10">
                <h1 className="text-xl font-semibold">Link expired</h1>
                <p className="text-muted-foreground mt-2">
                    This share link is no longer available.
                </p>
            </div>
        );
    }

    if (res.status === "LOCKED") {
        return (
            <div className="mx-auto w-full max-w-lg p-6">
                <SharePasswordGate shareId={shareId} />
            </div>
        );
    }

    if (res.status === "REQUEST_ACCESS") {
        return (
            <div className="mx-auto w-full max-w-lg p-6">
                <RequestAccessGate shareId={shareId} />
            </div>
        );
    }

    const data = res.data;

    if (!data) {
        return (
            <div className="p-10">
                <h1 className="text-xl font-semibold">Link not found</h1>
                <p className="text-muted-foreground mt-2">
                    This share link is no longer available.
                </p>
            </div>
        );
    }

    return (
        <div>
            <HeaderDetail data={data as any} />
            <main className="flex max-lg:flex-col gap-6 p-6 lg:items-start">
                <div className="md:flex-[2] lg:flex-[2.5] md:px-24">
                    <VideoPlayer
                        src={data!.url}
                        poster={data!.thumbnailUrl ?? undefined}
                    />
                </div>
                <div className="flex w-full min-w-0 flex-1 lg:max-w-md lg:sticky lg:top-6">
                    <VideoTranscriptPanel
                        videoId={data!.id}
                        initialStatus={data!.transcriptStatus}
                        initialTranscript={data!.transcript}
                        initialError={data!.transcriptError}
                    />
                </div>
            </main>
        </div>
    );
}

