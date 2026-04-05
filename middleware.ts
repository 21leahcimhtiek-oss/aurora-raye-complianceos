import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { request.cookies.set({ name, value, ...options }); response = NextResponse.next({ request: { headers: request.headers } }); response.cookies.set({ name, value, ...options }); },
        remove(name, options) { request.cookies.set({ name, value: '', ...options }); response = NextResponse.next({ request: { headers: request.headers } }); response.cookies.set({ name, value: '', ...options }); },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (!user && path.startsWith('/api') && !path.startsWith('/api/webhooks') && !path.startsWith('/api/checkout')) {
    return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 });
  }
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};