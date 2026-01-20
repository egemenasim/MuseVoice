
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import ClientPage from "./client-page"
import type { Metadata } from "next"

// Force dynamic rendering since we depend on searchParams/params
export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ artifactCode: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { artifactCode } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Simple metadata fetch
    const { data: artifact } = await supabase
        .from('artifacts')
        .select('base_image_url')
        .eq('artifact_number', artifactCode)
        .single()

    return {
        title: `Artifact ${artifactCode} | MuseVoice`,
        openGraph: {
            images: artifact?.base_image_url ? [artifact.base_image_url] : [],
        }
    }
}

export default async function ArtifactPage({ params }: PageProps) {
    const { artifactCode } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch Artifact Base
    const { data: artifact, error: artifactError } = await supabase
        .from('artifacts')
        .select('*')
        .eq('artifact_number', artifactCode)
        .single()

    if (artifactError || !artifact) {
        console.error("Artifact not found:", artifactError)
        notFound()
    }

    // 2. Fetch All Supported Languages
    const { data: languages, error: langError } = await supabase
        .from('languages')
        .select('*')
        .order('name')

    if (langError || !languages) {
        console.error("Languages error:", langError)
        // Return a minimal error UI
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                Error loading content configuration.
            </div>
        )
    }

    // 3. Fetch All Translations for this artifact (to avoid waterfall on client)
    const { data: translations, error: transError } = await supabase
        .from('artifact_translations')
        .select('*')
        .eq('artifact_id', artifact.id)

    if (transError) {
        console.error("Translations error:", transError)
    }

    return (
        <ClientPage
            artifact={artifact}
            languages={languages}
            translations={translations || []}
        />
    )
}
