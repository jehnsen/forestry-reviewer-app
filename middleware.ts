import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Everything below these prefixes requires a signed-in account. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/practice",
  "/mock-exam",
  "/analytics",
  "/settings",
];

const LOGIN_PATH = "/login";

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without configuration there is no way to tell who is signed in. Let the
  // request through so the pages can render their own "Supabase is not
  // configured" state, rather than failing every route with a 500.
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  // Reassigned by setAll below, because refreshed auth cookies have to ride
  // back out on the response that is actually returned.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Also refreshes an expired access token as a side effect, which is why this
  // runs on every matched request and not only the protected ones.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtected(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.search = "";
    // Remember where they were headed so login can send them back.
    redirectUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return redirectWithSession(redirectUrl, response);
  }

  if (user && pathname === LOGIN_PATH) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return redirectWithSession(redirectUrl, response);
  }

  return response;
}

/**
 * Redirect without dropping refreshed auth cookies — they were written to
 * `response`, which is being discarded in favour of the redirect.
 */
function redirectWithSession(to: URL, carrying: NextResponse) {
  const redirect = NextResponse.redirect(to);
  carrying.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie);
  });
  return redirect;
}

export const config = {
  matcher: [
    /*
     * Everything except Next's own assets and static files. Auth cookies are
     * refreshed on each matched request, so the match is deliberately broad.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
