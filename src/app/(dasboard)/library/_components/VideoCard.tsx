"use client";
import DeleteModal from "@/components/modals/DeleteModal";
import { copyToClipBoard } from "@/lib/utils";
import { User, Video } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegSmile } from "react-icons/fa";
import { LuEye } from "react-icons/lu";
import { RiLinkM } from "react-icons/ri";
import { toast } from "sonner";
import { PiDotsThreeBold } from "react-icons/pi";
import { deleteVideo } from "@/actions/video.actions";
export const VideoCard = (props: Video & { user: User }) => {
    const {
        description,
        title,
        thumbnailUrl,
        id,
        url,
        userId,
        duration,
        visibility,
        user: { name, avatarUrl },
    } = props;
    return (
        <Link
            href={`/share/${id}`}
            className="overflow-hidden group cursor-pointer rounded-2xl transition-all duration-200 hover:ring-primary ring-transparent ring-2   border-border border"
        >
            <div className="h-[14rem] z-12  bg-[#F8F8F8] relative">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="absolute gap-2 hidden  z-12 p-3 top-0  right-0 h-full group-hover:flex flex-col "
                >
                    <DeleteModal
                        action={async () => {
                            const { error } = await deleteVideo(id);
                            if (error) {
                                return toast.error("Error deleting Video");
                            }
                            toast.success("Video deleted successfully");
                        }}
                    />
                    <div
                        onClick={async () => {
                            copyToClipBoard(`${location.origin}/share/${id}`)
                                .then((e) => {
                                    toast.success("Link copied successfully");
                                })
                                .catch((e) => {
                                    toast.error("Failed to copy text");
                                });
                        }}
                        className="cursor-pointer p-1 bg-white rounded-md"
                    >
                        <RiLinkM />
                    </div>
                    <div
                        onClick={async () => {
                            copyToClipBoard(`${location.origin}/share/${id}`)
                                .then((e) => {
                                    toast.success("Link copied successfully");
                                })
                                .catch((e) => {
                                    toast.error("Failed to copy text");
                                });
                        }}
                        className="cursor-pointer p-1 bg-white rounded-md"
                    >
                        {/* <RiLinkM /> */}
                        <PiDotsThreeBold />
                    </div>
                </div>
                <div className="bg-black/40 z-0 group-hover:bg-black/70 absolute inset-0"></div>
                <Image
                    className="w-full h-full z-0 object-center"
                    width={500}
                    height={500}
                    src={thumbnailUrl! as string}
                    alt="Poster"
                    loading="lazy"
                />
            </div>
            <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-center gap-2">
                    <div className="size-8 flex-center font-bold bg-[#8D6E63] overflow-hidden rounded-full">
                        <Image
                            src={avatarUrl as string}
                            width={200}
                            height={200}
                            alt="20029"
                            className="object-center object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-[15px]">{name}</h1>
                        <p className="text-xs font-bold text-muted-foreground">
                            {visibility}
                        </p>
                    </div>
                </div>
                <div className="font-bold my-3 line-clamp-2">{title}</div>
                <div className="flex  text-muted-foreground font-light items-center gap-4">
                    <p className="flex items-center gap-1">
                        <LuEye className="text-sm" />
                        <span className="text-sm">0</span>
                    </p>
                    <p className="flex items-center gap-1">
                        <BiCommentDetail className="text-sm" />
                        <span className="text-sm">4</span>
                    </p>
                    <p className="flex items-center gap-1">
                        <FaRegSmile className="text-sm" />
                        <span className="text-sm">2</span>
                    </p>
                </div>
            </div>
        </Link>
    );
};
