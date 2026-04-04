import React from "react";
import { FaRegFolderClosed } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { Folder, Video } from "@prisma/client";

type Props = {
    folders: (Folder & { videos: Video[] })[];
};

const Folders = ({ folders }: Props) => {
      if (!folders || folders.length === 0) {
        return null;
    }
    return (
        <div className="">
            <h1 className="font-bold text-lg">Folders</h1>
            <FolderContainer folders={folders || []} />
        </div>
    );
};

export default Folders;

const FolderContainer = ({ folders }: { folders: Props['folders'] }) => {
    
    return (
        <div className="w-full pt-5 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 lg:grid-cols-4 ">
            {folders.map((e, index) => {
                return <FolderCard folder={e} key={index} />;
            })}
        </div>
    );
};

const FolderCard = ({ folder }: { folder: Folder & { videos: Video[] } }) => {
    return (
        <div className="border p-4 px-6 border-border rounded-2xl ring-transparent ring-2 cursor-pointer flex-center hover:ring-indigo-500">
            <div className="flex justify-between  flex-1 items-center">
                <div className="flex items-center gap-2">
                    <FaRegFolderClosed />
                    <div className="">
                        <h1 className="font-bold">{folder.name}</h1>
                        <p>{folder.videos.length} videos</p>
                    </div>
                </div>

                <div>
                    <BsThreeDots />
                </div>
            </div>
        </div>
    );
};
