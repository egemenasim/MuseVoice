import { supabase } from "@/lib/supabase"
import { QRGenerator } from "@/components/QRGenerator"
import Link from "next/link"

// Force dynamic
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const { data: artifacts, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching artifacts:", error)
        // Return empty state or error message instead of crashing
        return (
            <div className="min-h-screen p-8 text-center text-zinc-500">
                <p>Could not load artifacts. Please check your Supabase connection.</p>
                <p className="text-xs mt-2 font-mono">{error.message}</p>
            </div>
        )
    }

    // Note: Real admin would require Auth check here.
    // For now we assume RLS handles it or this page is protected by middleware (not implemented in this scope).

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Admin Dashboard
                </h1>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                    + New Artifact
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifacts?.map((artifact) => (
                    <div key={artifact.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">{artifact.artifact_number}</h3>
                                <p className="text-xs text-zinc-500 font-mono text-ellipsis overflow-hidden">
                                    ID: {artifact.id}
                                </p>
                            </div>
                            <QRGenerator value={`https://musevoice.vercel.app/${artifact.artifact_number}`} size={80} />
                        </div>

                        <div className="mt-auto pt-4 border-t border-zinc-800">
                            <div className="flex gap-2">
                                <Link
                                    href={`/${artifact.artifact_number}`}
                                    className="text-sm text-indigo-400 hover:text-indigo-300"
                                >
                                    View Public Page &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {!artifacts?.length && (
                    <div className="col-span-full text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        No artifacts found. Create one in Supabase to see it here.
                    </div>
                )}
            </div>
        </div>
    )
}
