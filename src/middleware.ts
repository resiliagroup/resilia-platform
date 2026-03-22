import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const PROTECTED = ['/hub', '/form', '/tesis-agi', '/uzman', '/board', '/settings', '/ygg-pano', '/omni-sprint', '/near-miss', '/oda']
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  let response = NextResponse.next({
    request: { headers: request.headers }
  })

  const supabase = createServerClient(
    'https://gqguwgbopgnpwzjwcexl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response = NextResponse.next({
              request: { headers: request.headers }
            })
            response.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/hub/:path*', '/form/:path*', '/tesis-agi', '/uzman/:path*', '/board/:path*', '/settings', '/ygg-pano', '/omni-sprint', '/near-miss', '/oda/:path*']
}
