import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import ComicCard from "@/app/components/ui/ComicCard";
import ReviewForm from "./review-form";

type PageProps = {
  params: Promise<{
    wineId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CurrentWineReviewPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { wineId } = await params;
  const id = Number(wineId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const member = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!member) {
    redirect("/login");
  }

  async function saveRating(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/login");
    }

    const member = await prisma.members.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!member) {
      redirect("/login");
    }

    const wineId = Number(formData.get("wineId"));

function parseScore(value: FormDataEntryValue | null): number {
  const normalized = String(value ?? "")
    .trim()
    .replace(",", ".");

  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    throw new Error("Ungültige Bewertungsdaten.");
  }

  return parsed;
}

const color = parseScore(formData.get("color"));
const smell = parseScore(formData.get("smell"));
const taste = parseScore(formData.get("taste"));
const finish = parseScore(formData.get("finish"));
const overall = parseScore(formData.get("overall"));
const comment = String(formData.get("comment") ?? "");

    if (Number.isNaN(wineId)) {
  throw new Error("Ungültige Bewertungsdaten.");
}

    const existingAllowedRating = await prisma.ratings.findFirst({
      where: {
        wine_id: wineId,
        member_id: member.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingAllowedRating) {
      throw new Error(
        "Für diesen Wein ist keine Bewertung für dieses Mitglied vorgesehen."
      );
    }

    const calculated = Number(
      ((color + smell + taste + finish) / 4).toFixed(2)
    );

    await prisma.ratings.update({
      where: {
        id: existingAllowedRating.id,
      },
      data: {
        color_score: color,
        smell_score: smell,
        taste_score: taste,
        finish_score: finish,
        overall_score: overall,
        calculated_score: calculated,
        points_text: comment || null,
        review_flag: false,
        review_reason: null,
      },
    });

    redirect("/dashboard/offene-bewertungen");
  }

  const wine = await prisma.wines.findUnique({
    where: { id },
    include: {
      tastings: {
        include: {
          members: true,
        },
      },
      ratings: {
        where: {
          member_id: member.id,
        },
        take: 1,
      },
    },
  });

  if (!wine) {
    notFound();
  }

  const existingRating = wine.ratings[0] ?? null;

  if (!existingRating) {
    return (
      <div className="bg-white text-neutral-950">
        <HeroSection
          imageSrc="/images/Header_Tasting.webp"
          imageAlt="Bewertung nicht verfügbar"
          badge="Mitgliederbereich"
          title="Bewertung nicht verfügbar"
          description="Für diesen Wein ist keine Bewertung für dein Mitgliedskonto vorgesehen."
        />

        <Section>
          <ComicCard className="relative overflow-hidden px-6 py-8">
            <div className="text-sm font-black uppercase tracking-[0.25em] text-red-700">
              Kein Zugriff
            </div>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
              Dieser Wein gehört nicht zu deinen offenen Bewertungen
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-700">
              Du kannst nur Weine bewerten, für die für dein Mitgliedskonto
              tatsächlich eine Bewertung vorgesehen ist.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard/offene-bewertungen"
                className="inline-flex border-2 border-black bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
              >
                Zu meinen offenen Bewertungen
              </Link>
            </div>
          </ComicCard>
        </Section>
      </div>
    );
  }

  const colorDefault =
    existingRating.color_score != null
      ? String(Number(existingRating.color_score))
      : "";

  const smellDefault =
    existingRating.smell_score != null
      ? String(Number(existingRating.smell_score))
      : "";

  const tasteDefault =
    existingRating.taste_score != null
      ? String(Number(existingRating.taste_score))
      : "";

  const finishDefault =
    existingRating.finish_score != null
      ? String(Number(existingRating.finish_score))
      : "";

  const overallDefault =
    existingRating.overall_score != null
      ? String(Number(existingRating.overall_score))
      : "";

  const commentDefault = existingRating.points_text ?? "";

  const calculatedDefault =
    existingRating.calculated_score != null
      ? Number(existingRating.calculated_score).toFixed(2)
      : null;

  const wineTitle =
    wine.producer === wine.wine_name
      ? wine.wine_name
      : [wine.producer, wine.wine_name].filter(Boolean).join(" ");

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
        imageSrc="/images/Header_Tasting.webp"
        imageAlt="Wein bewerten"
        badge="Mitgliederbereich"
        title="Wein bewerten"
        description="Hier kannst du deine Bewertung für den ausgewählten Wein erfassen oder aktualisieren."
      />

      <Section>
        <SectionHeader kicker="Bewertung" title={wineTitle} />

        <ComicCard className="relative mb-10 overflow-hidden px-6 pb-8 pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Jahrgang
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {wine.vintage ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Land
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {wine.country ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Gastgeber
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {wine.tastings?.members?.display_name ?? "Unbekannt"}
              </div>
            </div>

            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                Dein Status
              </div>
              <div className="mt-2 text-2xl font-black uppercase">
                {existingRating.overall_score != null ? "Bewertet" : "Offen"}
              </div>
            </div>
          </div>
        </ComicCard>

        <ComicCard className="relative overflow-hidden px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8">
          <div className="mb-6">
            <div className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-red-700">
              Formular
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Bewertung erfassen
            </h2>
          </div>
        <ReviewForm
  action={saveRating}
  wineId={wine.id}
  colorDefault={colorDefault}
  smellDefault={smellDefault}
  tasteDefault={tasteDefault}
  finishDefault={finishDefault}
  overallDefault={overallDefault}
  commentDefault={commentDefault}
  calculatedDefault={calculatedDefault}
/>
        </ComicCard>
      </Section>
    </div>
  );
}
