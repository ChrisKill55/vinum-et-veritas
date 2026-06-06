import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_LOCKOUT_MINUTES = 15;
const TWO_FACTOR_MAX_ATTEMPTS = 5;
const TWO_FACTOR_TTL_MINUTES = 10;
const RESEND_API_URL = "https://api.resend.com/emails";

type MemberLoginRecord = {
  id: number;
  first_name: string;
  display_name: string | null;
  email: string | null;
  password_hash: string | null;
  role: string;
  is_active: boolean;
};

type ChallengeRecord = {
  id: string;
  member_id: number;
  code_hash: string;
  expires_at: Date;
  attempts: number;
  consumed_at: Date | null;
};

export type VerifiedLoginMember = {
  id: number;
  firstName: string;
  displayName: string | null;
  email: string;
  role: string;
};

export type LoginStartResult =
  | { ok: true; challengeToken: string; maskedEmail: string }
  | { ok: false; reason: "invalid" | "locked" | "mail_failed"; retryAfterMinutes?: number };

function getPepper(): string {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "missing-auth-secret";
}

function hashValue(value: string): string {
  return bcrypt.hashSync(`${value}:${getPepper()}`, 10);
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(`${value}:${getPepper()}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function addMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function getRequestIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return requestHeaders.get("x-real-ip") ?? "unknown";
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, 2);

  return `${visible}${"*".repeat(Math.max(2, localPart.length - visible.length))}@${domain}`;
}

async function loginRateKey(email: string, ip: string): Promise<string> {
  return sha256(`login:${normalizeEmail(email)}:${ip}`);
}

async function getLockedUntil(email: string, ip: string): Promise<Date | null> {
  const key = await loginRateKey(email, ip);
  const rows = await prisma.$queryRaw<Array<{ locked_until: Date | null }>>`
    SELECT locked_until
    FROM login_rate_limits
    WHERE key = ${key}
      AND reset_at > NOW()
    LIMIT 1
  `;

  const lockedUntil = rows[0]?.locked_until;

  return lockedUntil && lockedUntil.getTime() > Date.now() ? lockedUntil : null;
}

async function recordFailedLogin(email: string, ip: string): Promise<void> {
  const key = await loginRateKey(email, ip);

  await prisma.$executeRaw`
    INSERT INTO login_rate_limits (key, attempts, locked_until, reset_at, updated_at)
    VALUES (${key}, 1, NULL, NOW() + ${LOGIN_WINDOW_MINUTES} * INTERVAL '1 minute', NOW())
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE
        WHEN login_rate_limits.reset_at <= NOW() THEN 1
        ELSE login_rate_limits.attempts + 1
      END,
      locked_until = CASE
        WHEN login_rate_limits.reset_at > NOW()
          AND login_rate_limits.attempts + 1 >= ${LOGIN_MAX_ATTEMPTS}
        THEN NOW() + ${LOGIN_LOCKOUT_MINUTES} * INTERVAL '1 minute'
        ELSE login_rate_limits.locked_until
      END,
      reset_at = CASE
        WHEN login_rate_limits.reset_at <= NOW()
        THEN NOW() + ${LOGIN_WINDOW_MINUTES} * INTERVAL '1 minute'
        ELSE login_rate_limits.reset_at
      END,
      updated_at = NOW()
  `;
}

async function clearFailedLogins(email: string, ip: string): Promise<void> {
  const key = await loginRateKey(email, ip);

  await prisma.$executeRaw`
    DELETE FROM login_rate_limits
    WHERE key = ${key}
  `;
}

async function sendTwoFactorCode(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? process.env.AUTH_EMAIL_FROM;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Vinum et Veritas";

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[2FA] Resend nicht konfiguriert. Login-Code fuer ${email}: ${code}`);
      return true;
    }

    console.error("2FA-Mailversand nicht konfiguriert: RESEND_API_KEY oder RESEND_FROM_EMAIL fehlt.");
    return false;
  }

  const text = [
    "Hallo,",
    "",
    `Ihr Login-Code lautet: ${code}`,
    "",
    `Der Code ist ${TWO_FACTOR_TTL_MINUTES} Minuten gueltig.`,
    "Wenn Sie diesen Login nicht ausgeloest haben, aendern Sie bitte Ihr Passwort.",
    "",
    siteName,
  ].join("\n");

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: `Ihr Login-Code fuer ${siteName}`,
        text,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error("2FA-Mailversand via Resend fehlgeschlagen.", {
        status: response.status,
        response: responseText,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("2FA-Mailversand via Resend fehlgeschlagen.", error);
    return false;
  }
}

export async function startEmailTwoFactorLogin(email: string, password: string): Promise<LoginStartResult> {
  const normalizedEmail = normalizeEmail(email);
  const ip = await getRequestIp();
  const lockedUntil = await getLockedUntil(normalizedEmail, ip);

  if (lockedUntil) {
    return {
      ok: false,
      reason: "locked",
      retryAfterMinutes: Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000)),
    };
  }

  const member = await prisma.members.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!member || !member.password_hash || !member.email || !member.is_active) {
    await recordFailedLogin(normalizedEmail, ip);
    return { ok: false, reason: "invalid" };
  }

  const passwordValid = await bcrypt.compare(password, member.password_hash);

  if (!passwordValid) {
    await recordFailedLogin(normalizedEmail, ip);
    return { ok: false, reason: "invalid" };
  }

  await clearFailedLogins(normalizedEmail, ip);

  const challengeToken = crypto.randomUUID();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const tokenHash = await sha256(`challenge:${challengeToken}`);
  const ipHash = await sha256(`ip:${ip}`);

  await prisma.$executeRaw`
    DELETE FROM login_2fa_challenges
    WHERE expires_at < NOW()
      OR consumed_at IS NOT NULL
  `;

  await prisma.$executeRaw`
    INSERT INTO login_2fa_challenges (id, member_id, token_hash, code_hash, expires_at, ip_hash)
    VALUES (${crypto.randomUUID()}, ${member.id}, ${tokenHash}, ${hashValue(code)}, ${addMinutes(TWO_FACTOR_TTL_MINUTES)}, ${ipHash})
  `;

  const sent = await sendTwoFactorCode(member.email, code);

  if (!sent) {
    return { ok: false, reason: "mail_failed" };
  }

  return {
    ok: true,
    challengeToken,
    maskedEmail: maskEmail(member.email),
  };
}

export async function verifyEmailTwoFactorLogin(
  challengeToken: string,
  code: string
): Promise<VerifiedLoginMember | null> {
  const cleanCode = code.replace(/\D/g, "");

  if (!challengeToken || cleanCode.length !== 6) {
    return null;
  }

  const ip = await getRequestIp();
  const tokenHash = await sha256(`challenge:${challengeToken}`);
  const ipHash = await sha256(`ip:${ip}`);
  const rows = await prisma.$queryRaw<Array<ChallengeRecord & { members: MemberLoginRecord }>>`
    SELECT
      c.id,
      c.member_id,
      c.code_hash,
      c.expires_at,
      c.attempts,
      c.consumed_at,
      row_to_json(m.*) AS members
    FROM login_2fa_challenges c
    JOIN members m ON m.id = c.member_id
    WHERE c.token_hash = ${tokenHash}
      AND c.ip_hash = ${ipHash}
    LIMIT 1
  `;
  const challenge = rows[0];

  if (!challenge || challenge.consumed_at || challenge.expires_at.getTime() <= Date.now()) {
    return null;
  }

  if (challenge.attempts >= TWO_FACTOR_MAX_ATTEMPTS) {
    return null;
  }

  const codeValid = bcrypt.compareSync(`${cleanCode}:${getPepper()}`, challenge.code_hash);

  if (!codeValid) {
    await prisma.$executeRaw`
      UPDATE login_2fa_challenges
      SET attempts = attempts + 1
      WHERE id = ${challenge.id}
    `;
    return null;
  }

  await prisma.$executeRaw`
    UPDATE login_2fa_challenges
    SET consumed_at = NOW()
    WHERE id = ${challenge.id}
      AND consumed_at IS NULL
  `;

  const member = challenge.members;

  if (!member?.email || !member.is_active) {
    return null;
  }

  return {
    id: member.id,
    firstName: member.first_name,
    displayName: member.display_name,
    email: member.email,
    role: member.role,
  };
}
