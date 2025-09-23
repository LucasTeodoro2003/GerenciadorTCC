// middleware.ts
import { auth } from "@/shared/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req:any) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const res = NextResponse.next();
  res.headers.set("x-user-id", session.user.id);
  return res;
}
export const config = {
  matcher: ["/dashboard/:path*"],
};
