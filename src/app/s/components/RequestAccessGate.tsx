"use client";

import {
    confirmApprovedShareAccess,
    requestShareAccess,
} from "@/actions/share.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
    shareId: string;
};

export default function RequestAccessGate({ shareId }: Props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [requested, setRequested] = useState(false);
    const [pending, start] = useTransition();

    const emailTrimmed = useMemo(() => email.trim(), [email]);

    const submit = () => {
        start(async () => {
            const res = await requestShareAccess(shareId, emailTrimmed);
            if (res.error === "INVALID_EMAIL") {
                toast.error("Enter a valid email");
                return;
            }
            if (res.error) {
                toast.error("Could not request access");
                return;
            }
            toast.success("Request sent");
            setRequested(true);
        });
    };

    const checkApproval = () => {
        start(async () => {
            const res = await confirmApprovedShareAccess(shareId, emailTrimmed);
            if (res.error === "NOT_APPROVED") {
                toast.message("Not approved yet");
                return;
            }
            if (res.error) {
                toast.error("Could not check approval");
                return;
            }
            toast.success("Access granted");
            router.refresh();
        });
    };

    return (
        <div className="border-border bg-card text-card-foreground w-full rounded-xl border p-5 shadow-sm">
            <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground size-4" />
                <h2 className="text-sm font-semibold tracking-tight">
                    Request permission to view
                </h2>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
                This video is private. Ask the owner for permission.
            </p>

            <div className="mt-4 flex gap-2">
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={pending}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                    }}
                />
                <Button
                    onClick={submit}
                    disabled={pending || emailTrimmed.length === 0}
                >
                    {pending ? "Sending…" : "Request"}
                </Button>
            </div>

            {requested ? (
                <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="text-muted-foreground size-4" />
                        Request pending approval
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={checkApproval}
                        disabled={pending || emailTrimmed.length === 0}
                    >
                        Refresh
                    </Button>
                </div>
            ) : null}
        </div>
    );
}

