import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 10;

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Bitte aktuelles und neues Passwort eintragen." },
      { status: 400 }
    );
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      {
        error: `Das neue Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`,
      },
      { status: 400 }
    );
  }

  if (currentPassword === newPassword) {
    return NextResponse.json(
      {
        error:
          "Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.",
      },
      { status: 400 }
    );
  }

  const member = await prisma.members.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      password_hash: true,
      is_active: true,
    },
  });

  if (!member?.password_hash || !member.is_active) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    member.password_hash
  );

  if (!currentPasswordMatches) {
    return NextResponse.json(
      { error: "Das aktuelle Passwort ist nicht korrekt." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.members.update({
    where: { id: member.id },
    data: { password_hash: passwordHash },
  });

  return NextResponse.json({ ok: true });
}
