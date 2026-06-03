import Image from "next/image";

interface DinelyLogoProps {
  width?: number;
  height?: number;
  className?: string;
  /** White card behind logo — for dark or colored backgrounds */
  onDark?: boolean;
  priority?: boolean;
}

export function DinelyLogo({
  width = 130,
  height = 48,
  className = "",
  onDark = false,
  priority = false,
}: DinelyLogoProps) {
  const logo = (
    <Image
      src="/logo.png"
      alt="Dinely"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );

  if (onDark) {
    return (
      <span className="inline-flex w-fit items-center rounded-xl bg-white px-4 py-2.5 shadow-md">
        {logo}
      </span>
    );
  }

  return <span className="inline-flex w-fit items-center">{logo}</span>;
}
