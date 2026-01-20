"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Database } from "@/lib/database.types"

type Language = Database['public']['Tables']['languages']['Row']

interface LanguageSelectorProps {
    currentLanguage: string
    languages: Language[]
    onLanguageChange: (code: string) => void
}

export function LanguageSelector({ currentLanguage, languages, onLanguageChange }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [])

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-95 hover:bg-white/20"
                aria-label="Change Language"
            >
                <Globe className="h-6 w-6 text-white" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-3xl bg-zinc-900 border-t border-white/10 shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h2 className="text-xl font-medium text-white">Select Language</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto p-4 space-y-2 pb-10">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            onLanguageChange(lang.code)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl transition-all",
                                            currentLanguage === lang.code
                                                ? "bg-indigo-600/20 border border-indigo-500/50"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{lang.flag_emoji}</span>
                                            <div className="text-left">
                                                <div className={cn(
                                                    "font-medium",
                                                    currentLanguage === lang.code ? "text-indigo-400" : "text-zinc-200"
                                                )}>
                                                    {lang.native_name}
                                                </div>
                                                <div className="text-sm text-zinc-500">{lang.name}</div>
                                            </div>
                                        </div>
                                        {currentLanguage === lang.code && (
                                            <Check className="h-5 w-5 text-indigo-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
