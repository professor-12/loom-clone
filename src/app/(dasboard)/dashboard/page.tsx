// import { getUser, signOut } from '@/actions/auth.actions'
// import { useAuth } from '@/context/AuthContext'
// import { getUser } from '@/services/auth.service'
import { redirect } from "next/navigation";
// import React from 'react'

import { auth } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Page = async () => {
    const { status } = await auth();
    if (status == 401) {
        redirect("/login");
    }
    return (
        <div className="pt-15 w-full space-y-1 flex flex-col items-center">
            <Image
                src="/home-empty-state.png"
                className="w-[27rem] h-[20rem]"
                width={4000}
                height={4000}
                alt="Width Empty state"
            />
            <h1 className="text-2xl text-center font-extrabold">
                Work’s always better together
            </h1>
            <p className="text-lg text-muted-foreground text-center text-balance max-w-[60%] mx-auto">
                Add teammates and you’ll be able to collaborate and quickly get
                a sense of what’s happening at work.
            </p>
            <div className="pt-5">
                <Button className="mx-auto rounded-2xl font-semibold">
                    Send an Invite
                </Button>
            </div>
        </div>
    );
};

export default Page;
