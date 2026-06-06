import type { NextRequest } from "next/server";
import { guardDashboardRequest } from "@/lib/dashboard-auth-guard";

// Fallback for older Next.js versions:
// Rename this file to middleware.ts and remove proxy.ts if proxy.ts is not supported.
export async function middleware(request: NextRequest) {
  return guardDashboardRequest(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
