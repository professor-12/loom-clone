import { assertFolderAccess } from "@/actions/folder.action";
import LibraryView from "../../library/_components/LibraryView";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ folderId: string }>;
};

export const metadata: Metadata = {
    title: "Folder | Library | Loop",
};

export default async function FolderPage({ params }: Props) {
    const { folderId } = await params;
    const access = await assertFolderAccess(folderId);
    if (access.error === "Unauthorized") {
        redirect("/login");
    }
    if (access.error) {
        notFound();
    }
    return (
        <LibraryView
            folderId={folderId}
            folderName={access.data!.name}
        />
    );
}
