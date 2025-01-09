import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const publicRoutes = ['/login', '/register']

  const token = await getToken({ req })

  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf)$).*)',
  ],
}
