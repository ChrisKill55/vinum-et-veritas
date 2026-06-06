import type { NextRequest } from "next/server";
import { guardDashboardRequest } from "@/lib/dashboard-auth-guard";

export async function proxy(request: NextRequest) {
  return guardDashboardRequest(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
