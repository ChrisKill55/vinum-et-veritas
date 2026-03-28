import React from "react";

type HeroSplitSectionProps = {
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  title: string;
  description?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  size?: "default" | "large";
};

export default function HeroSplitSection({
  imageSrc,
  imageAlt,
  badge,
  title,
  description,
  leftContent,
  rightContent,
  size = "default",
}: HeroSplitSectionProps) {
  const verticalPadding = size === "large" ? "py-24 md:py-32" : "py-20 md:py-24";

  return (
    <section className="relative overflow-hidden border-b-4 border-black">
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/18" />
      </div>

      <div className={`relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] ${verticalPadding}`}>
        <div className="max-w-3xl self-center">
          {badge ? (
            <div className="comic-badge mb-4 px-4 py-2 text-sm font-black uppercase tracking-[0.3em]">
              {badge}
            </div>
          ) : null}

          <h1 className="text-4xl font-black uppercase leading-tight text-white md:text-6xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              {description}
            </p>
          ) : null}

          {leftContent ? <div className="mt-10">{leftContent}</div> : null}
        </div>

        {rightContent ? (
          <div className="grid gap-4 self-end sm:grid-cols-2 lg:grid-cols-2">
            {rightContent}
          </div>
        ) : null}
      </div>
    </section>
  );
}