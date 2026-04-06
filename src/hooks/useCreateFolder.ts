import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { createFolderAction } from "@/actions/folder.action";
import { useRouter } from "next/navigation";
export const useCreateFolder = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const createFolder = useCallback(
        async (parentId?: string | null) => {
            startTransition(async () => {
                const { error, data, status } = await createFolderAction(
                    parentId ?? null,
                );
                  if (error) {
                    if (status === 401) {
                        toast.error("Unauthorized");
                        return;
                    }
                        if (status === 500) {
                          console.log(error);
                        toast.error("Could not create folder");
                        return;
                    }
                }
                toast.success("Folder created");
                router.refresh();
                });
            },
            [router]
        );
        return { isPending, createFolder };
    };
