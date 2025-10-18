import { useState, useRef, useCallback } from "react";
import useRecordingDuration from "./useDuration";
import { handlePlay } from "@/lib/utils";

const useScreenRecord = (upLoadStream: (a: Blob) => Promise<any>) => {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [micStream, setMicStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isNotPermitted, setIsNotpermitted] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const uploadRef = useRef(false);
    const { duration, startDuration, stopDuration } = useRecordingDuration();

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // 🎥 start camera
    const startCamera = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setCameraStream(stream);
    }, []);

    const stopCamera = useCallback(() => {
        cameraStream?.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
    }, [cameraStream]);

    const toggleCamera = useCallback(
        (enable: boolean) => {
            cameraStream
                ?.getVideoTracks()
                .forEach((track) => (track.enabled = enable));
        },
        [cameraStream]
    );

    const startMic = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        setMicStream(stream);
    };

    const stopMic = useCallback(() => {
        micStream?.getTracks().forEach((track) => track.stop());
        setMicStream(null);
    }, [micStream]);

    const toggleMic = useCallback(
        (enable: boolean) => {
            micStream
                ?.getAudioTracks()
                .forEach((track) => (track.enabled = enable));
        },
        [cameraStream]
    );
    const startScreen = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            setScreenStream(stream);
            return stream;
        } catch (err) {
            setIsNotpermitted(true);
            stopAll({ upload: false });
        }
    };
    const stopScreen = useCallback(() => {
        screenStream?.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
    }, [screenStream]);

    const toggleScreen = useCallback(
        (enable: boolean) => {
            screenStream
                ?.getTracks()
                .forEach((track) => (track.enabled = enable));
        },
        [screenStream]
    );

    const startRecording = useCallback(async () => {
        const screenStream = await startScreen();
        console.log(screenStream);
        handlePlay();
        await new Promise((a, b) => setTimeout(a, 700));
        const tracks: MediaStreamTrack[] = [
            // ...(cameraStream?.getTracks() || []),
            ...(micStream?.getTracks() || []),
            ...(screenStream?.getTracks() || []),
        ];

        if (!tracks.length) {
            console.warn("No active streams to record");
            return;
        }

        const combined = new MediaStream(tracks);
        recorderRef.current = new MediaRecorder(combined);
        chunksRef.current = [];
        99;

        startDuration();
        recorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorderRef.current.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setRecordedBlob(blob);
            stopDuration();
            if (uploadRef.current) {
                await upLoadStream?.(blob);
            }
            stopAll({ upload: false });
            chunksRef.current = [];
        };

        recorderRef.current.start();
        setRecording(true);
    }, [cameraStream, micStream, screenStream]);

    const stopRecording = useCallback((upload: boolean) => {
        uploadRef.current = upload;
        recorderRef.current?.stop();
        setRecording(false);
    }, []);

    const pauseRecording = () => {
        if (recording && !isPaused) {
            recorderRef.current!?.pause();
            stopDuration();
            setIsPaused(true);
        }
    };
    const resumeRecording = () => {
        if (recording && isPaused) {
            recorderRef.current?.resume();
            startDuration();
            setIsPaused(false);
        }
    };

    const stopAll = ({ upload = false }: { upload: boolean }) => {
        stopCamera();
        stopScreen();
        stopMic();
        stopRecording(upload);
    };

    return {
        cameraStream,
        micStream,
        screenStream,
        recording,
        recordedBlob,
        startMic,
        stopMic,
        toggleMic,
        startCamera,
        stopCamera,
        startScreen,
        stopScreen,
        startRecording,
        stopRecording,
        stopAll,
        pauseRecording,
        resumeRecording,
        toggleCamera,
        toggleScreen,
        isNotPermitted,
        isPaused,
        duration,
    };
};

export default useScreenRecord;
