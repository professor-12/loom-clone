"use client";
import LoopVideoEngine from "@/components/loop-recorder-extension/LoopEngine";
import { Button } from "@/components/ui/button";
import DropDown from "@/components/ui/drop-down";
import { Upload, Video } from "lucide-react";
import React, { useRef, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
    folderId?: string | null;
};

const NewVideoButton = ({ folderId = null }: Props) => {
    const [recordOpen, setRecordOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (folderId) {
            formData.append("folderId", folderId);
        }
        try {
            await axios.post("/api/video/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Video uploaded");
            router.refresh();
            if (folderId) {
                router.push(`/f/${folderId}`);
            } else {
                router.push("/library");
            }
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <DropDown>
                <DropDown.Trigger>
                    <Button
                        className="text-sm font-bold"
                        disabled={uploading}
                    >
                        <span>{uploading ? "Uploading…" : "New Video"}</span>
                        <span>
                            <PiCaretDownBold className="text-xl font-bold text-white" />
                        </span>
                    </Button>
                </DropDown.Trigger>
                <DropDown.Body align="center" className="!rounded-2xl">
                    <ul className="font-poppins">
                        <DropDown.Trigger>
                            <li
                                onClick={() => setRecordOpen(true)}
                                className="flex cursor-pointer gap-2 rounded-2xl p-3 px-4 hover:bg-slate-400/20"
                            >
                                <Video strokeWidth="1.4" />
                                Record a video
                            </li>
                        </DropDown.Trigger>
                        <li
                            onClick={() => fileRef.current?.click()}
                            className="text-muted-foreground flex cursor-pointer items-center gap-1 rounded-2xl p-3 px-4 hover:bg-slate-400/20"
                        >
                            <Upload className="text-sm" strokeWidth={"1.4"} />
                            Upload a video
                        </li>
                    </ul>
                </DropDown.Body>
            </DropDown>
            {recordOpen && (
                <LoopVideoEngine
                    folderId={folderId}
                    onClose={() => setRecordOpen(false)}
                />
            )}
        </div>
    );
};

export default NewVideoButton;
