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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
