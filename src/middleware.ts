import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/hub', '/uzman', '/dashboard', '/eoc-dashboard', '/omni-dashboard',
  '/board', '/oda', '/form', '/harita', '/tesis-agi', '/gecmis-analizler',
  '/sistem-ayarlari', '/settings', '/natech-simulator', '/hfe-motoru',
  '/ai-analiz', '/near-miss', '/omnicrisis', '/omniplan', '/beylikduzu-komuta',
  '/ygg-pano', '/omni-sprint']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (!isProtected) return NextResponse.next()

  const authCookie = request.cookies.get('sb-gqguwgbopgnpwzjwcexl-auth-token')

  if (!authCookie?.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(authCookie.value))
    if (!parsed.access_token || parsed.expires_at < Math.floor(Date.now() / 1000)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
