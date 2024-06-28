import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request) {
  const projectPaths = ["/write", "/mylist"];
  const { pathname } = request.nextUrl;

  // console.log("Request URL:", request.nextUrl);

  if (projectPaths.some((path) => pathname.startsWith(path))) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      // console.log("JWT Token:", token);

      if (!token) {
        return NextResponse.redirect(
          new URL("http://localhost:3000/api/auth/signin", request.url)
        );
      }
    } catch (error) {
      console.log("JWT 검증 오류:", error);
      return NextResponse.error();
    }
  }

  return NextResponse.next();
}
