import Header from "./header";
import Tab from "./tab";
import Video from "./Video";
import { getVideos } from "@/actions/video.actions";


type LibraryViewProps = {
    folderId: string | null;
};

export default async function LibraryView({ folderId }: LibraryViewProps) {
    const videosRes = await getVideos({ limit: 100, page: 1, folderId: folderId ?? undefined });

    const videos =
        videosRes.error === null ? videosRes.data : [];
    const videoTotal =
        videosRes.error === null ? videosRes.total : 0;

    return (
        <div className="pt-15">
            <div className="space-y-12">
                <Header />
                <div className="flex border-b w-full justify-between">
                    <Tab />
                    <div className="text-sm font-medium text-muted-foreground/60">
                        <p>{videoTotal} videos</p>
                    </div>
                </div>
                <div>
                    <Video
                    />
                </div>
            </div>
        </div>
    );
}
