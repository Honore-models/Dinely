import Image from "next/image";

interface DinelyLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  /** Transparent SVG variant for the green brand panel */
  onDark?: boolean;
}

export function DinelyLogo({
  width = 130,
  height = 48,
  className = "",
  onDark = false,
  priority = false,
}: DinelyLogoProps) {
  return (
    <Image
      src={onDark ? "/logo-on-dark.svg" : "/logo.png"}
      alt="Dinely"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
