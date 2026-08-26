import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

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
  const { resolvedTheme } = useTheme();
  const useDarkLogo = onDark || resolvedTheme === "dark";

  return (
    <Image
      src={useDarkLogo ? "/logo-on-dark.svg" : "/logo.svg"}
      alt="Dinely"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
