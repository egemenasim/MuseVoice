
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (request: NextRequest) => {
    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    if (!supabaseUrl || !supabaseKey) {
        // If env vars are missing, we can't create the client.
        // Return a dummy client or just the response to prevent crashing the middleware.
        // Since middleware needs to return a client for the caller to use, we might throw a friendly error
        // or returns a mock that does nothing.
        // For now, let's log and return a basic response.
        console.error("Supabase Env Vars missing in Middleware!")
        return {
            supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) } } as any,
            response: supabaseResponse
        }
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        },
    );

    return { supabase, response: supabaseResponse }
};
