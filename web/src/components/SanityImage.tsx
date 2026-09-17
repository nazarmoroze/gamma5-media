import { Image } from "next-sanity/image";

import { hotspotPosition, urlFor } from "@/sanity/image";

type SanityImageValue = {
  alt?: string | null;
  hotspot?: { x?: number; y?: number } | null;
  asset?: { _id: string; metadata?: { lqip?: string | null } | null } | null;
} | null;

type SanityImageProps = {
  image: SanityImageValue;
  sizes: string;
  className?: string;
  alt?: string;
  preload?: boolean;
};

// Fills its positioned parent and crops around the editor's hotspot.
export function SanityImage({ image, sizes, className, alt, preload }: SanityImageProps) {
  if (!image?.asset?._id) return null;
  const lqip = image.asset.metadata?.lqip ?? undefined;

  return (
    <Image
      src={urlFor(image.asset._id).url()}
      alt={alt ?? image.alt ?? ""}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      style={{ objectFit: "cover", objectPosition: hotspotPosition(image) }}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
    />
  );
}
