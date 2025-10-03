import { useState, useRef, useCallback } from "react";

const useScreenRecord = (upLoadStream: (a: MediaStream) => any) => {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [micStream, setMicStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isNotPermitted, setIsNotpermitted] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [timer, setTimer] = useState(5);

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
    // 🎤 start mic

    // 🖥️ start screen

    const startMic = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            // video: true,
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
    const startScreen = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            setScreenStream(stream);
            return stream;
        } catch (err) {
            setIsNotpermitted(true);
            stopAll();
        }
    }, []);

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

    // ⏺️ start recording (combines all available streams)
    const startRecording = useCallback(async () => {
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

        recorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setRecordedBlob(blob);
            stopAll();
            chunksRef.current = [];
        };

        recorderRef.current.start();
        setRecording(true);
    }, [cameraStream, micStream, screenStream]);

    const stopRecording = useCallback(() => {
        recorderRef.current?.stop();
        setRecording(false);
    }, []);

    const pauseRecording = () => {
        if (recording && !isPaused) {
            recorderRef.current!?.pause();
            setIsPaused(true);
        }
    };
    const resumeRecording = () => {
        if (recording && isPaused) {
            recorderRef.current?.resume();
            setIsPaused(false);
        }
    };

    const stopAll = () => {
        stopCamera();
        stopScreen();
        stopMic();
        stopRecording();
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
    };
};

export default useScreenRecord;
