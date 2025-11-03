import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

/**
 * Supabase client for browser-side operations
 * Use this in Client Components
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See env.local.example for reference."
    );
  }

  // Check if URL is a placeholder - if so, throw a more helpful error
  if (supabaseUrl.includes('[YOUR_PROJECT_REF]') || supabaseUrl.includes('your-project-ref')) {
    throw new Error(
      `Supabase URL is not configured. You have a placeholder value "${supabaseUrl}". Please update NEXT_PUBLIC_SUPABASE_URL in your .env.local file with your actual Supabase project URL.`
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}". Please check your NEXT_PUBLIC_SUPABASE_URL environment variable.`
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

