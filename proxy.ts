import { NextResponse, type NextRequest } from "next/server";

const APP_URL = "/app";
const FULLWIDTH_P = "\uFF50";

const OLD_APP_PATHS = new Set([
  "/App",
  "/apps",
  `/ap${FULLWIDTH_P}`,
  "/ap%EF%BD%90",
]);

function safeDecodePathname(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const decodedPathname = safeDecodePathname(nextUrl.pathname);

  if (
    OLD_APP_PATHS.has(nextUrl.pathname) ||
    OLD_APP_PATHS.has(decodedPathname)
  ) {
    const url = nextUrl.clone();
    url.pathname = APP_URL;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/App", "/apps", "/apｐ"],
};
