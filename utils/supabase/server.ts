
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
    if (!supabaseUrl || !supabaseKey) {
        console.error("⚠️ Supabase Env Vars missing! App will show connection error.")
        // Return a mock client that returns error responses instead of crashing the server
        return {
            from: () => ({
                select: () => Promise.resolve({ data: null, error: { message: "Supabase not configured. Add env vars in Vercel." } }),
                insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                eq: (field: any, value: any) => ({
                    select: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                }),
                single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                order: (field: any, opts: any) => ({
                    select: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                }),
            }),
            auth: {
                getUser: () => Promise.resolve({ data: { user: null }, error: null })
            }
        } as any
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};
