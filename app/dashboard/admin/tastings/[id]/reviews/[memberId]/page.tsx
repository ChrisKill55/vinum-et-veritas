import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/app/components/ui/HeroSection";
import Section from "@/app/components/ui/Section";
import SectionHeader from "@/app/components/ui/SectionHeader";
import AdminMemberReviewForm from "./review-form";
import { getWineDisplayName } from "@/lib/wine-labels";

type PageProps = {
  params: Promise<{
    id: string;
    memberId: string;
  }>;
};

export default async function AdminMemberReviewPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentMember = await prisma.members.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentMember) {
    redirect("/login");
  }

  const role = String(currentMember.role ?? "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "PRESIDENT";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const { id, memberId } = await params;
  const tastingId = Number(id);
  const participantId = Number(memberId);

  if (Number.isNaN(tastingId) || Number.isNaN(participantId)) {
    notFound();
  }

  const participant = await prisma.tasting_participants.findFirst({
    where: {
      id: participantId,
      tasting_id: tastingId,
    },
    include: {
      members: {
        select: {
          id: true,
          display_name: true,
          email: true,
        },
      },
    },
  });

  if (!participant) {
    notFound();
  }

  const tasting = await prisma.tastings.findUnique({
    where: { id: tastingId },
    include: {
      members: true,
      wines: {
        orderBy: { sequence_no: "asc" },
        include: {
          ratings: {
            where: {
              participant_id: participant.id,
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!tasting) {
    notFound();
  }

  async function saveRatings(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/login");
    }

    const currentMember = await prisma.members.findUnique({
      where: { email: session.user.email },
    });

    if (!currentMember) {
      redirect("/login");
    }

    const role = String(currentMember.role ?? "").toUpperCase();
    const isAdmin = role === "ADMIN" || role === "PRESIDENT";

    if (!isAdmin) {
      redirect("/dashboard");
    }

    const tastingIdValue = Number(formData.get("tastingId"));
    const participantIdValue = Number(formData.get("participantId"));

    if (Number.isNaN(tastingIdValue) || Number.isNaN(participantIdValue)) {
      throw new Error("Ungültige IDs.");
    }

    const participant = await prisma.tasting_participants.findFirst({
      where: {
        id: participantIdValue,
        tasting_id: tastingIdValue,
      },
      select: {
        id: true,
        member_id: true,
      },
    });

    if (!participant) {
      throw new Error("Teilnehmer nicht gefunden.");
    }

    const wines = await prisma.wines.findMany({
      where: { tasting_id: tastingIdValue },
      orderBy: { sequence_no: "asc" },
      select: { id: true },
    });

    for (const wine of wines) {
      const color = Number(formData.get(`color_${wine.id}`));
      const smell = Number(formData.get(`smell_${wine.id}`));
      const taste = Number(formData.get(`taste_${wine.id}`));
      const finish = Number(formData.get(`finish_${wine.id}`));
      const overall = Number(formData.get(`overall_${wine.id}`));
      const comment = String(formData.get(`comment_${wine.id}`) ?? "");

      if (
        Number.isNaN(color) ||
        Number.isNaN(smell) ||
        Number.isNaN(taste) ||
        Number.isNaN(finish) ||
        Number.isNaN(overall)
      ) {
        continue;
      }

      const calculated = Number(
        ((color + smell + taste + finish) / 4).toFixed(2)
      );

      await prisma.ratings.upsert({
        where: {
          wine_id_participant_id: {
            wine_id: wine.id,
            participant_id: participant.id,
          },
        },
        update: {
          color_score: color,
          smell_score: smell,
          taste_score: taste,
          finish_score: finish,
          overall_score: overall,
          calculated_score: calculated,
          points_text: comment || null,
        },
        create: {
          wine_id: wine.id,
          member_id: participant.member_id,
          participant_id: participant.id,
          color_score: color,
          smell_score: smell,
          taste_score: taste,
          finish_score: finish,
          overall_score: overall,
          calculated_score: calculated,
          points_text: comment || null,
          review_flag: false,
        },
      });
    }

    redirect(`/dashboard/admin/tastings/${tastingIdValue}/reviews`);
  }

  const wines = tasting.wines.map((wine) => {
    const rating = wine.ratings[0] ?? null;

    const wineTitle = getWineDisplayName(wine);

    return {
      id: wine.id,
      sequence_no: wine.sequence_no,
      title: [wineTitle, wine.vintage].filter(Boolean).join(" "),
      country: wine.country ?? "—",
      color: rating?.color_score != null ? String(Number(rating.color_score)) : "",
      smell: rating?.smell_score != null ? String(Number(rating.smell_score)) : "",
      taste: rating?.taste_score != null ? String(Number(rating.taste_score)) : "",
      finish:
        rating?.finish_score != null ? String(Number(rating.finish_score)) : "",
      overall:
        rating?.overall_score != null ? String(Number(rating.overall_score)) : "",
      comment: rating?.points_text ?? "",
    };
  });

  return (
    <div className="bg-white text-neutral-950">
      <HeroSection
      imageSrc="/images/Header_Tasting.webp"
      imageAlt="Bewertung nachpflegen"
      badge="Admin"
      title="Bewertung nachpflegen"
      description={`Bewertungen für ${
        participant.members?.display_name ?? participant.guest_name ?? "Teilnehmer"
      } im Tasting vom ${new Date(tasting.tasting_date).toLocaleDateString("de-DE")}.`}
      />

      <Section>
        <SectionHeader
          kicker="Verwaltung"
          title={participant.members?.display_name ?? participant.guest_name ?? "Teilnehmer"}
        />

        <AdminMemberReviewForm
          action={saveRatings}
          tastingId={tasting.id}
          participantId={participant.id}
          tastingDate={new Date(tasting.tasting_date).toLocaleDateString("de-DE")}
          hostName={tasting.members?.display_name ?? "Unbekannt"}
          wines={wines}
        />
      </Section>
    </div>
  );
}
