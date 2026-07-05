import { NextResponse } from "next/server";
import { constantTimeEqual, isSafeRedirectPath } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const access = url.searchParams.get("access") || "";
  const requestedNext = url.searchParams.get("next") || "";
  const safeNext = isSafeRedirectPath(requestedNext, ["/jp/app", "/app"])
    ? requestedNext
    : "/app";
  const expected = process.env.BILION_FOUNDER_ACCESS_CODE?.trim();

  if (!expected) {
    return new NextResponse("Missing BILION_FOUNDER_ACCESS_CODE", {
      status: 500,
    });
  }

  if (!constantTimeEqual(access, expected)) {
    const deniedUrl = new URL(
      safeNext === "/jp/app" ? "/jp/founder" : "/founder",
      req.url,
    );
    deniedUrl.searchParams.set("error", "invalid_access");
    return NextResponse.redirect(deniedUrl);
  }

  const res = NextResponse.redirect(new URL(safeNext, req.url));

  res.cookies.set("founder_access", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
