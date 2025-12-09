import { NextResponse } from "next/server";
import { StackServerApp } from "@stackframe/stack";

export async function middleware(request) {
    const user = await StackServerApp.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }
    return NextResponse.next();
  }
  
  export const config = {
    
    matcher: '/protected/:path*',
  };

