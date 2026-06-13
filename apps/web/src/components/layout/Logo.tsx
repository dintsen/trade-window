import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Shared Trade Window logo mark + wordmark.
 * Uses tw-icon.svg (the window icon) + styled text.
 * Consistent across all pages.
 */
export function Logo({ href = "/", size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-sm" },
    md: { icon: 24, text: "text-base" },
    lg: { icon: 28, text: "text-lg" },
  };
  const { icon, text } = sizes[size];

  const inner = (
    <span className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/tw-icon.svg"
        alt="Trade Window icon"
        width={icon}
        height={icon}
        className="shrink-0"
        priority
      />
      <span className={`font-bold tracking-tight ${text} leading-none`}>
        <span className="text-white">Trade</span>
        <span className="text-[#3ECF8E]">Window</span>
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="flex items-center">
      {inner}
    </Link>
  );
}
