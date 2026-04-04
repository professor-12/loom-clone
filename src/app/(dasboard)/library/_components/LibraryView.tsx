import Header from "./header";
import Tab from "./tab";
import Video from "./Video";
import Folders from "./Folders";
import { getFolderBreadcrumb, getFolders } from "@/actions/folder.action";
import { getVideos } from "@/actions/video.actions";

type LibraryViewProps = {
    folderId: string;
    folderName: string;
};

export default async function LibraryView({
    folderId,
    folderName,
}: LibraryViewProps) {
    const [videosRes, foldersRes, breadcrumbRes] = await Promise.all([
        getVideos({ limit: 100, page: 1, folderId }),
        getFolders({ parentId: folderId }),
        getFolderBreadcrumb(folderId),
    ]);

    const folderBreadcrumb =
        breadcrumbRes.error === null && breadcrumbRes.data?.length
            ? breadcrumbRes.data
            : [{ id: folderId, name: folderName }];

    const videoTotal =
        videosRes.error === null ? videosRes.total : 0;
    const childFolders =
        foldersRes.error === null ? foldersRes.data : [];

    return (
        <div className="pt-15">
            <div className="space-y-12">
                <Header folderBreadcrumb={folderBreadcrumb} />
                <div className="flex w-full justify-between border-b">
                    <Tab />
                    <div className="text-muted-foreground/60 text-sm font-medium">
                        <p>{videoTotal} videos in this folder</p>
                    </div>
                </div>
                <Folders
                    folders={childFolders}
                    totalFolderCount={childFolders.length}
                    expanded
                    showMoreButton={false}
                    sectionTitle="Subfolders"
                />
                <div>
                    <Video folderId={folderId} />
                </div>
            </div>
        </div>
    );
}
