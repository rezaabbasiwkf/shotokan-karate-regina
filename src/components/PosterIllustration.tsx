import Image from "next/image";

type PosterIllustrationProps = {
  category: "features" | "programs" | "athletes";
  name: string;
  alt?: string;
  compact?: boolean;
};

/** Decorative artwork, separate from the academy's authentic photographs. */
export function PosterIllustration({
  category,
  name,
  alt = "",
  compact = false,
}: PosterIllustrationProps) {
  return (
    <div
      className={`poster-art-frame relative mx-auto aspect-square shrink-0 overflow-hidden rounded-2xl ${compact ? "w-28 sm:w-32" : "w-44 max-w-full"}`}
    >
      <Image
        src={`/images/poster-cards/${category}/${name.replace(/\.(png|webp)$/, "")}.webp`}
        alt={alt}
        fill
        className="object-contain"
        sizes={compact ? "128px" : "176px"}
      />
    </div>
  );
}
