import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const res = await fetch('https://gqguwgbopgnpwzjwcexl.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok || !data.access_token) {
    return NextResponse.json({ error: 'Geçersiz e-posta veya şifre.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })

  // Supabase SSR cookie formatı
  const projectRef = 'gqguwgbopgnpwzjwcexl'
  const cookieOpts = {
    path: '/',
    httpOnly: false,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  }

  const cookieVal = encodeURIComponent(JSON.stringify({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    expires_in: data.expires_in,
    token_type: data.token_type,
    user: data.user,
  }))

  response.cookies.set(`sb-${projectRef}-auth-token`, cookieVal, cookieOpts)

  return response
}
