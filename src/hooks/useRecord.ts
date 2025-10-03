"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type UseRecordResult = {
    start: () => void;
    stop: () => void;
    reset: () => void;
    isRecording: boolean;
    hasFinished: boolean;
    blob: Blob | null;
    url: string | null;
};

const useRecord = (stream: MediaStream | null): UseRecordResult => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [blob, setBlob] = useState<Blob | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const start = () => {
        if (!stream) return;
        if (isRecording) return;

        const recorder = new MediaRecorder(stream, {
            // mimeType: "video/webm;codecs=vp9,opus",
        });
        mediaRecorderRef.current = recorder;
        setChunks([]);
        setHasFinished(false);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                console.log(e.data);
                setChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = () => {
            const completeBlob = new Blob(chunks, { type: "video/webm" });
            console.log(chunks);
            setBlob(completeBlob);
            setUrl(URL.createObjectURL(completeBlob));
            setHasFinished(true);
        };

        recorder.start();
        setIsRecording(true);
    };

    const stop = () => {
        alert("This is good");
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const reset = () => {
        setChunks([]);
        setBlob(null);
        setUrl(null);
        setHasFinished(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [isRecording, url]);

    return { start, stop, reset, isRecording, hasFinished, blob, url };
};

export default useRecord;
