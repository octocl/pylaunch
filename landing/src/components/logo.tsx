import type { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  showText?: boolean;
}

function Logo({ showText = true, className, ...props }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className || ""}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {/* Flame */}
        <path
          d="M14 29 Q16 34 18 29 Z"
          fill="#00d992"
          opacity="0.25"
        />

        {/* Green snake — head top-left, crosses to right, down to left fin */}
        <path
          d="M16 5 C12 5 7 9 7 15 C7 19 19 17 19 21 C19 25 13 27 10 30"
          stroke="#00d992"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Yellow snake — head top-right, crosses to left, down to right fin */}
        <path
          d="M16 5 C20 5 25 9 25 15 C25 19 13 17 13 21 C13 25 19 27 22 30"
          stroke="#FFD43B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Shadow lines for depth */}
        <path
          d="M16 5 C12 5 7 9 7 15"
          stroke="#101010"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.08"
        />
        <path
          d="M16 5 C20 5 25 9 25 15"
          stroke="#101010"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.08"
        />

        {/* Snake heads */}
        <ellipse cx="13.5" cy="4.5" rx="2.2" ry="1.6" fill="#00d992" />
        <ellipse cx="18.5" cy="4.5" rx="2.2" ry="1.6" fill="#FFD43B" />
        <circle cx="13" cy="4" r="0.55" fill="#101010" />
        <circle cx="19" cy="4" r="0.55" fill="#101010" />

        {/* Fins */}
        <path d="M8 28 L5 31 L10 29 Z" fill="#00d992" opacity="0.5" />
        <path d="M24 28 L27 31 L22 29 Z" fill="#FFD43B" opacity="0.5" />
      </svg>
      {showText && (
        <span className="text-sm font-semibold tracking-tight text-foreground">
          PyLaunch
        </span>
      )}
    </div>
  );
}

export { Logo };
