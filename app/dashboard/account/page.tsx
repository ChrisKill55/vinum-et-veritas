import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import PasswordForm from "./password-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentMember = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      display_name: true,
      first_name: true,
      email: true,
    },
  });

  if (!currentMember) {
    redirect("/login");
  }

  const memberName =
    currentMember.display_name ?? currentMember.first_name ?? "Clubmitglied";

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Mitgliederkonto"
        badge="Mitgliederbereich"
        title="Mein Konto"
        description="Verwalte deine persönlichen Zugangsdaten für den internen Bereich."
      />

      <Section>
        <SectionHeader kicker="Zugang" title={`Hallo ${memberName}`} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <ComicCard className="px-6 py-6 md:px-8 md:py-8">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-700">
              Konto
            </div>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight">
              Passwort ändern
            </h2>
            <p className="mt-5 text-sm leading-7 text-neutral-700">
              Aus Sicherheitsgründen wird das aktuelle Passwort geprüft, bevor
              ein neues Passwort gespeichert wird. Das neue Passwort muss
              mindestens 10 Zeichen lang sein.
            </p>
            <div className="mt-6 border-t-2 border-black pt-6 text-sm leading-7 text-neutral-700">
              Angemeldet als{" "}
              <span className="font-black text-neutral-950">
                {currentMember.email}
              </span>
            </div>
          </ComicCard>

          <ComicCard className="px-6 py-6 md:px-8 md:py-8">
            <PasswordForm />
          </ComicCard>
        </div>
      </Section>
    </div>
  );
}
