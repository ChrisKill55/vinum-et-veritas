import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import NewTastingForm from "./new-tasting-form";

export default async function NewTastingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const member = await prisma.members.findUnique({
    where: { email: session.user.email },
  });

  if (!member) {
    redirect("/login");
  }

  const role = String(member.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const hosts = await prisma.members.findMany({
    where: { is_active: true },
    orderBy: { display_name: "asc" },
    select: {
      id: true,
      display_name: true,
    },
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Neues Tasting anlegen"
        badge="Admin"
        title="Neues Tasting anlegen"
        description="Lege ein neues Tasting an und füge direkt die Weine des Abends hinzu."
      />

      <Section>
        <SectionHeader
          kicker="Verwaltung"
          title="Tasting und Weine erfassen"
        />

        <NewTastingForm hosts={hosts} />
      </Section>
    </div>
  );
}