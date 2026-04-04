import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/actions/folder.action";

type Props = {
    folderId: string | null;
    breadcrumb: BreadcrumbItem[];
};

export default function LibraryBreadcrumb({ folderId, breadcrumb }: Props) {
    if (!folderId || breadcrumb.length === 0) {
        return null;
    }

    return (
        <nav
            aria-label="Folder path"
            className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
            <Link
                href="/library"
                className="font-medium text-foreground hover:underline"
            >
                Library
            </Link>
            {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                    <span key={item.id} className="flex items-center gap-1">
                        <ChevronRight className="size-4 shrink-0 opacity-60" />
                        {isLast ? (
                            <span className="font-semibold text-foreground">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={`/library/f/${item.id}`}
                                className="hover:underline"
                            >
                                {item.name}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
