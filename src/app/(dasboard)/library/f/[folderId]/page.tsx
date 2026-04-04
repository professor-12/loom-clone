import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ folderId: string }>;
};

/** Canonical folder URLs use `/f/[folderId]`. */
export default async function LibraryFolderRedirect({ params }: Props) {
    const { folderId } = await params;
    redirect(`/f/${folderId}`);
}
