import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const plainPassword = process.env.MEMBER_PASSWORD;

  if (!plainPassword) {
    throw new Error("MEMBER_PASSWORD muss gesetzt sein.");
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const memberId = 1;

  const updated = await prisma.members.update({
    where: { id: memberId },
    data: {
    email: "news@christian-kill.de",
    password_hash: passwordHash,
    role: "ADMIN",
    },
  });

  console.log("Mitglied aktualisiert:");
  console.log({
    id: updated.id,
    display_name: updated.display_name,
    email: updated.email,
    role: updated.role,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
