"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DEFAULT_PREVIEW = 4;

type Props = {
    /** When true, user is on the expanded folders view (`?tab=folders`). */
    expanded: boolean;
    /** Total folders the user has (not just the current slice). */
    totalFolderCount: number;
    /** How many folders are shown in compact mode; used to decide if “Show more” appears. */
    previewLimit?: number;
};

export function ShowMoreButton({
    expanded,
    totalFolderCount,
    previewLimit = DEFAULT_PREVIEW,
}: Props) {
    const router = useRouter();

    if (!expanded) {
        if (totalFolderCount === 0 || totalFolderCount <= previewLimit) {
            return null;
        }
        return (
            <Button
                type="button"
                onClick={() => router.push("/library?tab=folders")}
                variant="outline"
                className="rounded-xl text-sm font-bold"
            >
                Show more
            </Button>
        );
    }

    return (
        <Button
            type="button"
            onClick={() => router.push("/library")}
            variant="outline"
            className="rounded-xl text-sm font-bold"
        >
            Show less
        </Button>
    );
}
