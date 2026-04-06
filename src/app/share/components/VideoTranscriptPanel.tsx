"use client";

import { getVideoTranscriptSnapshot } from "@/actions/video.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TranscriptStatus } from "@prisma/client";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    videoId: string;
    initialStatus: TranscriptStatus;
    initialTranscript: string | null;
    initialError: string | null;
};

const POLL_MS = 4000;
const MAX_POLLS = 90;

export default function VideoTranscriptPanel({
    videoId,
    initialStatus,
    initialTranscript,
    initialError,
}: Props) {
    const [status, setStatus] = useState<TranscriptStatus>(initialStatus);
    const [transcript, setTranscript] = useState<string | null>(
        initialTranscript
    );
    const [error, setError] = useState<string | null>(initialError);
    const [pollTimedOut, setPollTimedOut] = useState(false);

    useEffect(() => {
        setStatus(initialStatus);
        setTranscript(initialTranscript);
        setError(initialError);
        setPollTimedOut(false);
    }, [initialStatus, initialTranscript, initialError, videoId]);

    useEffect(() => {
        if (status !== "PENDING") return;

        let cancelled = false;
        let polls = 0;
        let intervalId = 0;

        const tick = async () => {
            if (cancelled) return;
            polls += 1;
            if (polls > MAX_POLLS) {
                if (!cancelled) setPollTimedOut(true);
                window.clearInterval(intervalId);
                return;
            }
            const res = await getVideoTranscriptSnapshot(videoId);
            if (cancelled || !res.data) return;
            setStatus(res.data.transcriptStatus);
            setTranscript(res.data.transcript);
            setError(res.data.transcriptError);
            if (res.data.transcriptStatus !== "PENDING") {
                window.clearInterval(intervalId);
            }
        };

        void tick();
        intervalId = window.setInterval(tick, POLL_MS);
        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, [status, videoId]);

    return (
        <section
            className="border-border flex-1 bg-card text-card-foreground flex max-h-[min(520px,70vh)] flex-col rounded-xl border shadow-sm"
            aria-labelledby="transcript-heading"
        >
            <div className="border-border flex shrink-0 items-center gap-2 border-b px-4 py-3">
                <FileText className="text-muted-foreground size-4" />
                <h2
                    id="transcript-heading"
                    className="text-sm font-semibold tracking-tight"
                >
                    Transcript
                </h2>
            </div>

            <div className="min-h-[12rem] flex-1 overflow-y-auto px-4 py-3">
                {status === "PENDING" && (
                    <div className="space-y-3">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Loader2
                                className="size-4 shrink-0 animate-spin"
                                aria-hidden
                            />
                            Generating transcript…
                        </div>
                        <div className="space-y-2" aria-hidden>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className={cn(
                                        "h-3 rounded-md",
                                        i % 3 === 0 && "w-full",
                                        i % 3 === 1 && "w-[92%]",
                                        i % 3 === 2 && "w-[78%]"
                                    )}
                                />
                            ))}
                        </div>
                        {pollTimedOut ? (
                            <p className="text-muted-foreground text-xs">
                                Still processing. Refresh the page in a moment to
                                see the transcript.
                            </p>
                        ) : null}
                    </div>
                )}

                {status === "NONE" && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        No transcript for this video. Transcripts are created
                        automatically for new uploads when transcription is
                        enabled.
                    </p>
                )}

                {status === "FAILED" && (
                    <div className="space-y-2">
                        <p className="text-destructive text-sm font-medium">
                            Transcript could not be generated.
                        </p>
                        {error ? (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                {error}
                            </p>
                        ) : null}
                    </div>
                )}

                {status === "READY" && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {transcript?.trim()
                            ? transcript
                            : "No speech was detected in this video."}
                    </div>
                )}
            </div>
        </section>
    );
}
