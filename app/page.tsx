import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-zinc-950 to-black">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          MuseVoice
        </h1>
        <p className="text-xl text-zinc-400">
          Next-Generation Audio Guide Platform
        </p>

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

        <div className="mt-16 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left text-sm text-zinc-500">
          <p className="font-mono mb-2 text-zinc-400">Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create Supabase project & run <code>schema.sql</code></li>
            <li>Connect Vercel project</li>
            <li>Add env variables to Vercel & local <code>.env.local</code></li>
            <li>Upload assets to Supabase Storage</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
