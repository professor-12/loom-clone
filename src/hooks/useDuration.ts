import { useCallback, useRef, useState } from "react";

export default function useRecordingDuration() {
    const [duration, setDuration] = useState<number>(0);
    const rafRef = useRef<number | null>(null);
    const startTsRef = useRef<number | null>(null);

    const tick = useCallback(() => {
        if (!startTsRef.current) return;
        const now = performance.now();
        const elapsed = Math.floor((now - startTsRef.current) / 1000);
        setDuration(elapsed);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const startDuration = useCallback(() => {
        if (startTsRef.current) return;
        startTsRef.current = performance.now() - duration * 1000;
        rafRef.current = requestAnimationFrame(tick);
    }, [duration, tick]);

    const stopDuration = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        startTsRef.current = null;
    }, []);

    const resetDuration = useCallback(() => {
        stopDuration();
        setDuration(0);
    }, [stopDuration]);

    return { duration, startDuration, stopDuration, resetDuration } as const;
}
