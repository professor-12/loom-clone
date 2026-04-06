"use client";

import { unlockShareLink } from "@/actions/share.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SharePasswordGate({ shareId }: { shareId: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [pending, start] = useTransition();

    const submit = () => {
        start(async () => {
            const res = await unlockShareLink(shareId, password);
            if (res.error === "INVALID_PASSWORD") {
                toast.error("Incorrect password");
                return;
            }
            if (res.error) {
                toast.error("Could not unlock link");
                return;
            }
            toast.success("Unlocked");
            router.refresh();
        });
    };

    return (
        <div className="border-border bg-card text-card-foreground w-full rounded-xl border p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <Lock className="text-muted-foreground size-4" />
                <h2 className="text-sm font-semibold tracking-tight">
                    This video is password protected
                </h2>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
                Enter the password to continue.
            </p>
            <div className="mt-4 flex gap-2">
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={pending}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                    }}
                />
                <Button onClick={submit} disabled={pending || !password.trim()}>
                    {pending ? "Unlocking…" : "Unlock"}
                </Button>
            </div>
        </div>
    );
}

