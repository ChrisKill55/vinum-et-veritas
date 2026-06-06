import { NextResponse } from "next/server";
import { startEmailTwoFactorLogin } from "@/lib/auth-security";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Login fehlgeschlagen. Bitte pruefe E-Mail und Passwort." },
      { status: 400 }
    );
  }

  const result = await startEmailTwoFactorLogin(email, password);

  if (!result.ok) {
    if (result.reason === "locked") {
      return NextResponse.json(
        {
          ok: false,
          message: `Zu viele Login-Versuche. Bitte versuche es in etwa ${result.retryAfterMinutes} Minuten erneut.`,
        },
        { status: 429 }
      );
    }

    if (result.reason === "mail_failed") {
      return NextResponse.json(
        {
          ok: false,
          message: "Der Login-Code konnte nicht versendet werden. Bitte spaeter erneut versuchen.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Login fehlgeschlagen. Bitte pruefe E-Mail und Passwort." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    challengeToken: result.challengeToken,
    maskedEmail: result.maskedEmail,
  });
}
