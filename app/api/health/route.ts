import { NextResponse } from "next/server";

// This endpoint intentionally performs no database query. Monitoring services
// can use it without waking the Neon compute endpoint.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    { status: "ok" },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
