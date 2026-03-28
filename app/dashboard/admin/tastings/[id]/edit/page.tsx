import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import EditTastingForm from "./edit-tasting-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTastingPage({ params }: PageProps) {
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

  const { id } = await params;
  const tastingId = Number(id);

  if (Number.isNaN(tastingId)) {
    notFound();
  }

  const tasting = await prisma.tastings.findUnique({
    where: { id: tastingId },
    include: {
      wines: {
        orderBy: { sequence_no: "asc" },
      },
      members: true,
    },
  });

  if (!tasting) {
    notFound();
  }

  const hosts = await prisma.members.findMany({
    where: { is_active: true },
    orderBy: { display_name: "asc" },
    select: {
      id: true,
      display_name: true,
    },
  });

  const initialTasting = {
    id: tasting.id,
    tasting_date: tasting.tasting_date.toISOString().slice(0, 10),
    member_id: tasting.member_id,
    notes: tasting.notes ?? "",
    wines: tasting.wines.map((wine) => ({
      id: wine.id,
      sequence_no: wine.sequence_no,
      producer: wine.producer ?? "",
      wine_name: wine.wine_name ?? "",
      vintage: wine.vintage?.toString() ?? "",
      country: wine.country ?? "",
      region: wine.region ?? "",
      grape_variety: wine.grape_variety ?? "",
      alcohol_pct: wine.alcohol_pct?.toString() ?? "",
      price_eur: wine.price_eur?.toString() ?? "",
      comment: wine.comment ?? "",
    })),
  };

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Tasting bearbeiten"
        badge="Admin"
        title="Tasting bearbeiten"
        description="Bearbeite Datum, Gastgeber und die Weine des Tastings."
      />

      <Section>
        <SectionHeader
          kicker="Verwaltung"
          title={`Tasting vom ${new Date(tasting.tasting_date).toLocaleDateString("de-DE")}`}
        />

        <EditTastingForm hosts={hosts} initialTasting={initialTasting} />
      </Section>
    </div>
  );
}