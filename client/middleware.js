// middleware.js
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  console.log(path);
  const isPublicPath = path === "/";
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (isPublicPath && user) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

// Apply middleware to protect specific routes
export const config = {
  matcher: [
    "/dashboard",
    "/", // Protect all routes under /protected
  ],
};
