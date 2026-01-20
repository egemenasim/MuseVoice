
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

// Force dynamic
export const dynamic = 'force-dynamic'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Simple check to ensure connection is working by fetching languages
  // We use languages table since 'todos' doesn't exist in our schema
  const { data: languages, error } = await supabase.from('languages').select('count')

  // Connection Status UI
  let statusMessage = "✅ Connected to Supabase"
  let statusColor = "text-green-500"

  if (error) {
    statusMessage = "❌ Connection Failed"
    statusColor = "text-red-500"
    console.error("Supabase Connection Error:", error)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          MuseVoice
        </h1>
        <p className="text-xl text-zinc-400">
          Next-Generation Audio Guide Platform
        </p>

        {/* Status Indicator */}
        <div className={`p-4 rounded-lg bg-zinc-900 border border-zinc-800 ${statusColor} font-mono text-sm`}>
          {statusMessage}
          {error && <div className="text-xs mt-2 text-zinc-500">{error.message}</div>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/admin"
            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
          >
            Admin Dashboard
          </Link>
          <button
            className="px-8 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors cursor-not-allowed opacity-50"
          >
            Scan QR Code
          </button>
        </div>
      </div>
    </div>
  )
}
