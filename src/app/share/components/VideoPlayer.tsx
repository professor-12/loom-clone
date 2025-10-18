"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { TbRewindBackward5, TbRewindForward5 } from "react-icons/tb";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from "react-icons/md";

interface VideoPlayerProps {
      src: string;
      poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
      const videoRef = useRef<HTMLVideoElement>(null);
      const containerRef = useRef<HTMLDivElement>(null);

      const [isPlaying, setIsPlaying] = useState(false);
      const [isMuted, setIsMuted] = useState(false);
      const [progress, setProgress] = useState(0);
      const [duration, setDuration] = useState(0);
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [hoverTime, setHoverTime] = useState<number | null>(null);
      const [hoverX, setHoverX] = useState<number | null>(null);

      /** Format time mm:ss */
      const formatTime = (time: number): string => {
            if (isNaN(time)) return "0:00";
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60)
                  .toString()
                  .padStart(2, "0");
            return `${minutes}:${seconds}`;
      };

      /** Handle play/pause toggle */
      const togglePlay = useCallback(() => {
            if (!videoRef.current) return;
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
      }, [isPlaying]);

      /** Handle time update */
      const handleTimeUpdate = () => {
            if (!videoRef.current) return;
            const current = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setProgress((current / dur) * 100);
      };

      /** Handle progress (seek) change */
      const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!videoRef.current) return;
            const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
      };

      /** Show hover preview time */
      const handleProgressHover = (e: React.MouseEvent<HTMLInputElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const time = percent * (videoRef.current?.duration || 0);
            console.log(time)
            setHoverTime(time);
            setHoverX(e.clientX - rect.left);
      };

      const clearHover = () => {
            setHoverTime(null);
            setHoverX(null);
      };

      /** Handle skip forward/backward */
      const skip = (seconds: number) => {
            if (!videoRef.current) return;
            videoRef.current.currentTime += seconds;
      };

      /** Handle mute toggle */
      const toggleMute = () => {
            if (!videoRef.current) return;
            const muted = !isMuted;
            videoRef.current.muted = muted;
            setIsMuted(muted);
      };

      /** Handle fullscreen toggle */
      const toggleFullscreen = async () => {
            if (!containerRef.current) return;
            if (!document.fullscreenElement) {
                  await containerRef.current.requestFullscreen();
                  setIsFullscreen(true);
            } else {
                  await document.exitFullscreen();
                  setIsFullscreen(false);
            }
      };

      /** Keyboard shortcuts */
      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (!videoRef.current) return;

                  switch (e.key.toLowerCase()) {
                        case " ":
                              e.preventDefault();
                              togglePlay();
                              break;
                        case "arrowleft":
                              skip(-5);
                              break;
                        case "arrowright":
                              skip(5);
                              break;
                        case "m":
                              toggleMute();
                              break;
                        case "f":
                              toggleFullscreen();
                              break;
                        default:
                              break;
                  }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
      }, [togglePlay]);

      /** Setup event listeners */
      useEffect(() => {
            const video = videoRef.current;
            if (!video) return;

            const onLoadedMetadata = () => setDuration(video.duration);
            const onPlay = () => setIsPlaying(true);
            const onPause = () => setIsPlaying(false);
            const onEnded = () => setIsPlaying(false);

            video.addEventListener("loadedmetadata", onLoadedMetadata);
            video.addEventListener("play", onPlay);
            video.addEventListener("pause", onPause);
            video.addEventListener("ended", onEnded);
            video.addEventListener("timeupdate", handleTimeUpdate);

            return () => {
                  video.removeEventListener("loadedmetadata", onLoadedMetadata);
                  video.removeEventListener("play", onPlay);
                  video.removeEventListener("pause", onPause);
                  video.removeEventListener("ended", onEnded);
                  video.removeEventListener("timeupdate", handleTimeUpdate);
            };
      }, []);

      return (
            <div
                  ref={containerRef}
                  className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
            >
                  {/* Video */}
                  <video
                        ref={videoRef}
                        src={src}
                        poster={poster}
                        className="w-full h-full object-cover"
                        preload="metadata"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Progress Bar with hover preview */}
                        <div className="relative">
                              <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    onMouseMove={handleProgressHover}
                                    onMouseLeave={clearHover}
                                    className="w-full h-1 bg-gray-300 accent-white cursor-pointer"
                              />
                              {hoverTime !== null && hoverX !== null && (
                                    <div
                                          className="absolute -top-8 px-2 py-1 text-xs text-white bg-black/80 rounded-md transform -translate-x-1/2 pointer-events-none"
                                          style={{ left: `${hoverX}px` }}
                                    >
                                          {formatTime(hoverTime)}
                                    </div>
                              )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-4 py-3 text-white">
                              {/* Left Controls */}
                              <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} aria-label="Play/Pause">
                                          {isPlaying ? (
                                                <FaPause className="w-6 h-6" />
                                          ) : (
                                                <FaPlay className="w-6 h-6" />
                                          )}
                                    </button>
                                    <button onClick={() => skip(-5)} aria-label="Rewind 5 seconds">
                                          <TbRewindBackward5 className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => skip(5)} aria-label="Forward 5 seconds">
                                          <TbRewindForward5 className="w-6 h-6" />
                                    </button>
                                    <button onClick={toggleMute} aria-label="Toggle Mute">
                                          {isMuted ? (
                                                <HiSpeakerXMark className="w-6 h-6" />
                                          ) : (
                                                <HiSpeakerWave className="w-6 h-6" />
                                          )}
                                    </button>
                              </div>

                              {/* Center Time Display */}
                              <div className="text-sm font-medium select-none">
                                    {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                                    {formatTime(duration)}
                              </div>

                              {/* Fullscreen */}
                              <button onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
                                    {isFullscreen ? (
                                          <MdOutlineFullscreenExit className="w-6 h-6" />
                                    ) : (
                                          <MdOutlineFullscreen className="w-6 h-6" />
                                    )}
                              </button>
                        </div>
                  </div>
            </div>
      );
};

export default VideoPlayer;
