import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Platform route'ları — auth zorunlu
const PROTECTED_PREFIXES = [
  '/hub',
  '/form',
  '/beylikduzu-komuta',
  '/omni-dashboard',
  '/omniplan',
  '/omnicrisis',
  '/ygg-pano',
  '/near-miss',
  '/omni-sprint',
  '/eoc-dashboard',
  '/harita',
  '/tesis-agi',
  '/hfe-motoru',
  '/natech-simulator',
  '/ai-analiz',
  '/gecmis-analizler',
  '/sistem-ayarlari',
  '/settings',
  '/board',
  '/uzman',
  '/oda',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const response = NextResponse.next()

  const supabase = createServerClient(
    'https://gqguwgbopgnpwzjwcexl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|fonts|api).*)',
  ],
}
