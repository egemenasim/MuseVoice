"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { LanguageSelector } from "@/components/LanguageSelector"
import { AudioPlayer } from "@/components/AudioPlayer"
import type { Database } from "@/lib/database.types"

type Artifact = Database['public']['Tables']['artifacts']['Row']
type Language = Database['public']['Tables']['languages']['Row']
type Translation = Database['public']['Tables']['artifact_translations']['Row']

interface ClientPageProps {
    artifact: Artifact
    languages: Language[]
    translations: Translation[]
}

export default function ClientPage({ artifact, languages, translations }: ClientPageProps) {
    const [currentLangCode, setCurrentLangCode] = useState<string>("en")

    // Try to detect browser language on mount
    useEffect(() => {
        const browserLang = navigator.language.split('-')[0]
        const isSupported = languages.some(l => l.code === browserLang)
        if (isSupported) {
            setCurrentLangCode(browserLang)
        }
    }, [languages])

    const currentTranslation = translations.find(t => t.language_code === currentLangCode)

    // Fallback to English or first available if current language has no translation
    const activeTranslation = currentTranslation || translations.find(t => t.language_code === 'en') || translations[0]

    const isRtl = languages.find(l => l.code === currentLangCode)?.dir === 'rtl'

    return (
        <div className={`min-h-screen pb-32 ${isRtl ? 'rtl' : 'ltr'}`}>
            {/* Hero Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                {artifact.base_image_url ? (
                    <Image
                        src={artifact.base_image_url}
                        alt="Artifact"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-500">No Image Available</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <main className="px-6 -mt-20 relative z-10 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono text-zinc-300 border border-white/10">
                            {artifact.artifact_number}
                        </span>
                        {activeTranslation?.language_code && (
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-400 border border-white/5 uppercase">
                                {activeTranslation.language_code}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500 mb-6 leading-tight">
                        {activeTranslation?.title || "Untitled Artifact"}
                    </h1>

                    <div className="prose prose-invert prose-lg leading-relaxed text-zinc-300">
                        {activeTranslation?.description ? (
                            activeTranslation.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))
                        ) : (
                            <p className="text-zinc-500 italic">No description available in this language.</p>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Floating Controls */}
            <LanguageSelector
                currentLanguage={currentLangCode}
                languages={languages}
                onLanguageChange={setCurrentLangCode}
            />

            <AudioPlayer
                src={activeTranslation?.audio_url || null}
                title={activeTranslation?.title || ""}
            />
        </div>
    )
}
