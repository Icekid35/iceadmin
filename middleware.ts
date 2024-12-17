// import { NextResponse } from "next/server";

// // Completely disable Clerk authentication middleware
// export default function middleware(req: Request) {
//   return NextResponse.next(); // Allow all requests without authentication
// }

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"], // Apply to relevant routes
// };


import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
