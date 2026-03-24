import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const response = NextResponse.json({ ok: true })
  const cookiesToSet: CookieToSet[] = []

  const supabase = createServerClient(
    'https://gqguwgbopgnpwzjwcexl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
    {
      cookies: {
        getAll() { return [] },
        setAll(c: CookieToSet[]) { cookiesToSet.push(...c) },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 401 })
  }

  // Cookie'leri response'a yaz
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })

  return response
}
