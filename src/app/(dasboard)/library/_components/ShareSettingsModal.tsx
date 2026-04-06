"use client";

import {
    getOrCreateShareLink,
    getShareLinkOwnerSnapshot,
    rotateShareLink,
    updateShareLinkSettings,
} from "@/actions/share.actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { copyToClipBoard } from "@/lib/utils";
import { Link2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateVideoVisibility } from "@/actions/video.actions";
import type { Visibility } from "@prisma/client";
import {
    approveShareAccessRequest,
    denyShareAccessRequest,
    listShareAccessRequests,
} from "@/actions/share.actions";

type Props = {
    videoId: string;
    triggerClassName?: string;
};

function toDateTimeLocalValue(d: Date | null): string {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function ShareSettingsModal({ videoId, triggerClassName }: Props) {
    const [open, setOpen] = useState(false);
    const [shareId, setShareId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordEnabled, setPasswordEnabled] = useState(false);
    const [visibility, setVisibility] = useState<Visibility>("PRIVATE");
    const [accessRequests, setAccessRequests] = useState<
        {
            id: string;
            requestEmail: string;
            status: "PENDING" | "APPROVED" | "DENIED";
            requestedAt: Date;
            decidedAt: Date | null;
        }[]
    >([]);
    const [pending, start] = useTransition();

    const shareUrl = useMemo(() => {
        if (!shareId) return null;
        return `${location.origin}/s/${shareId}`;
    }, [shareId]);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        start(async () => {
            const created = await getOrCreateShareLink(videoId);
            if (cancelled) return;
            if (created.error || !created.data) {
                toast.error("Could not create share link");
                return;
            }
            setShareId(created.data.id);
            setExpiresAt(
                created.data.expiresAt ? toDateTimeLocalValue(new Date(created.data.expiresAt)) : ""
            );
            setPasswordEnabled(Boolean(created.data.passwordHash));
            setPassword("");

            const snapshot = await getShareLinkOwnerSnapshot(videoId);
            if (cancelled) return;
            if (snapshot.data) {
                setShareId(snapshot.data.id);
                setExpiresAt(
                    snapshot.data.expiresAt
                        ? toDateTimeLocalValue(new Date(snapshot.data.expiresAt))
                        : ""
                );
                setPasswordEnabled(Boolean(snapshot.data.passwordHash));
            }

            const reqs = await listShareAccessRequests(videoId);
            if (cancelled) return;
            if (!reqs.error && reqs.data) {
                setAccessRequests(
                    reqs.data.map((r: any) => ({
                        ...r,
                        requestedAt: new Date(r.requestedAt),
                        decidedAt: r.decidedAt ? new Date(r.decidedAt) : null,
                    }))
                );
            }
        });
        return () => {
            cancelled = true;
        };
    }, [open, videoId]);

    const doCopy = async () => {
        if (!shareUrl) return;
        await copyToClipBoard(shareUrl);
        toast.success("Share link copied");
    };

    const doRotate = () => {
        start(async () => {
            const res = await rotateShareLink(videoId);
            if (res.error || !res.data) {
                toast.error("Could not rotate link");
                return;
            }
            setShareId(res.data.id);
            setExpiresAt(res.data.expiresAt ? toDateTimeLocalValue(new Date(res.data.expiresAt)) : "");
            setPasswordEnabled(Boolean(res.data.passwordHash));
            setPassword("");
            toast.success("Link rotated");
        });
    };

    const doSave = () => {
        if (!shareId) return;
        start(async () => {
            const visRes = await updateVideoVisibility(videoId, visibility);
            if (visRes.error) {
                toast.error("Could not update visibility");
                return;
            }
            const res = await updateShareLinkSettings(shareId, {
                password: passwordEnabled ? password : "",
                expiresAt: expiresAt || null,
            });
            if (res.error) {
                toast.error("Could not save settings");
                return;
            }
            toast.success("Share settings saved");
            setOpen(false);
        });
    };

    const approve = (id: string) => {
        start(async () => {
            const res = await approveShareAccessRequest(id);
            if (res.error) {
                toast.error("Could not approve");
                return;
            }
            toast.success("Approved");
            setAccessRequests((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? { ...r, status: "APPROVED", decidedAt: new Date() }
                        : r
                )
            );
        });
    };

    const deny = (id: string) => {
        start(async () => {
            const res = await denyShareAccessRequest(id);
            if (res.error) {
                toast.error("Could not deny");
                return;
            }
            toast.success("Denied");
            setAccessRequests((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? { ...r, status: "DENIED", decidedAt: new Date() }
                        : r
                )
            );
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                asChild
                className={triggerClassName ?? "cursor-pointer p-1 bg-white rounded-md"}
            >
                <button type="button" aria-label="Share settings">
                    <Link2 className="size-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="!rounded-3xl p-8 pb-4">
                <DialogHeader>
                    <DialogTitle>Smart sharing</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <div className="text-sm font-semibold">Share link</div>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={shareUrl ?? "Creating link…"}
                                className="font-mono text-xs"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={doCopy}
                                disabled={!shareUrl || pending}
                            >
                                Copy
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={doRotate}
                                disabled={pending}
                            >
                                <RotateCcw className="mr-2 size-4" />
                                Rotate link
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <div className="space-y-2">
                            <div className="text-sm font-semibold">Visibility</div>
                            <select
                                value={visibility}
                                onChange={(e) =>
                                    setVisibility(e.target.value as Visibility)
                                }
                                disabled={pending}
                                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="PRIVATE">Private</option>
                                <option value="UNLISTED">Unlisted</option>
                                <option value="PUBLIC">Public</option>
                                <option value="WORKSPACE">Workspace</option>
                            </select>
                            <p className="text-muted-foreground text-xs">
                                Private and Workspace show as locked in your
                                library. Public/Unlisted show an open lock.
                            </p>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input
                                type="checkbox"
                                checked={passwordEnabled}
                                onChange={(e) => setPasswordEnabled(e.target.checked)}
                                disabled={pending}
                            />
                            Require password
                        </label>
                        {passwordEnabled ? (
                            <Input
                                type="password"
                                placeholder="Set a new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={pending}
                            />
                        ) : null}

                        <div className="space-y-2">
                            <div className="text-sm font-semibold">Expiration (optional)</div>
                            <Input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                disabled={pending}
                            />
                        </div>

                        {visibility === "PRIVATE" ? (
                            <div className="mt-2 space-y-2 rounded-xl border border-border p-3">
                                <div className="text-sm font-semibold">
                                    Access requests
                                </div>
                                {accessRequests.filter(
                                    (r) => r.status === "PENDING"
                                ).length === 0 ? (
                                    <p className="text-muted-foreground text-xs">
                                        No pending requests.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {accessRequests
                                            .filter((r) => r.status === "PENDING")
                                            .slice(0, 6)
                                            .map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="truncate text-xs font-medium">
                                                            {r.requestEmail}
                                                        </div>
                                                    </div>
                                                    <div className="flex shrink-0 gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => deny(r.id)}
                                                            disabled={pending}
                                                        >
                                                            Deny
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => approve(r.id)}
                                                            disabled={pending}
                                                        >
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={pending}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={doSave} disabled={pending || !shareId}>
                        {pending ? "Saving…" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

