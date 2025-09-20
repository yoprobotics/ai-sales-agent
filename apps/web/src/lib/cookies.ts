import { NextResponse } from 'next/server';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

export function setCookie(
  response: NextResponse,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const cookieOptions = {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options.sameSite ?? 'strict',
    maxAge: options.maxAge,
    path: options.path ?? '/',
    domain: options.domain,
  };

  response.cookies.set(name, value, cookieOptions);
}

export function deleteCookie(response: NextResponse, name: string) {
  response.cookies.delete(name);
}

export function getCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[name];
}
