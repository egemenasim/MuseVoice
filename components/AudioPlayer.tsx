"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AudioPlayerProps {
    src: string | null
    title: string
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            setProgress(0)
            if (src) {
                audioRef.current.load()
                // Auto play when source changes? Maybe not for policy reasons, but let's try
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { })
            }
        }
    }, [src])

    const togglePlay = () => {
        if (!audioRef.current || !src) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setProgress(0)
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    if (!src) return null

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-900 border-t border-white/10 backdrop-blur-xl p-4 safe-area-bottom shadow-2xl"
        >
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className="max-w-md mx-auto flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
                >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-indigo-300 mb-1 truncate">{title}</div>
                    <div className="relative h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-indigo-500"
                            style={{ width: `${progress}%` }}
                            layoutId="progress"
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {formatTime(audioRef.current?.currentTime || 0)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                            setIsPlaying(true);
                        }
                    }}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    )
}
