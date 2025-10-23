"use client";
import { copyToClipBoard } from "@/lib/utils";
import React from "react";
import { RiLinkM } from "react-icons/ri";
import { toast } from "sonner";

const CopyButton = () => {
    return (
        <div
            onClick={async () => {
                copyToClipBoard(location.href)
                    .then(() => {
                        toast.success("Link copied successfully");
                    })
                    .catch(() => {
                        toast.error("Failed to copy link");
                    });
            }}
            className="bg-[#1558BC] cursor-pointer text-white p-2 px-3 rounded-r-2xl items-center justify-center flex"
        >
            <RiLinkM className="h-6 w-6" />
        </div>
    );
};

export default CopyButton;
