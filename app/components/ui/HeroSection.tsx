import React from "react";

type HeroSectionProps = {
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  title: string;
  description?: string;
};

export default function HeroSection({
  imageSrc,
  imageAlt,
  badge,
  title,
  description,
}: HeroSectionProps) {
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

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
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
        </div>
      </div>
    </section>
  );
}