"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaFolderPlus } from "react-icons/fa6";
import { useCreateFolder } from "@/hooks/useCreateFolder";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const NewFolderButton = ({ folderId }: { folderId: string | null }) => {
    const { createFolder, isPending } = useCreateFolder();
    const handleCreateFolder = () => {
        createFolder(folderId)
    };
    return (
        <div>
            <Button
                className="font-bold text-sm rounded-xl"
                variant={"outline"}
                onClick={handleCreateFolder}
                disabled={isPending}
            >
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <div>
                        New Folder
                    </div>
                )}
            </Button>
        </div>
    );
};

export default NewFolderButton;
