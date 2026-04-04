import { assertFolderAccess } from "@/actions/folder.action";
import LibraryView from "../../_components/LibraryView";
import { Metadata } from "next";

type Props = {
    params: Promise<{ folderId: string }>;
};

export const metadata: Metadata = {
    title: "Folder | Library | Loop",
};

export default async function LibraryFolderPage({ params }: Props) {
    const { folderId } = await params;
    await assertFolderAccess(folderId);
    return <LibraryView folderId={folderId} />;
}

