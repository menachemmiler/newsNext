import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

const svg = (path: ReactNode, className?: string) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

export const SearchIcon = ({ className }: IconProps) =>
  svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </>,
    className,
  );

export const SunIcon = ({ className }: IconProps) =>
  svg(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>,
    className,
  );

export const MoonIcon = ({ className }: IconProps) =>
  svg(<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />, className);

export const BookmarkIcon = ({ className }: IconProps) =>
  svg(<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1z" />, className);

export const BookmarkFilledIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z" />
  </svg>
);

export const ShareIcon = ({ className }: IconProps) =>
  svg(
    <>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8 11.2 16 7.2M8 12.8l8 4" />
    </>,
    className,
  );

export const CopyIcon = ({ className }: IconProps) =>
  svg(
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16V5h11" />
    </>,
    className,
  );

export const CheckIcon = ({ className }: IconProps) =>
  svg(<path d="M5 12.5 9.5 17 19 7" />, className);

export const MenuIcon = ({ className }: IconProps) =>
  svg(
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>,
    className,
  );

export const CloseIcon = ({ className }: IconProps) =>
  svg(<path d="M6 6l12 12M18 6 6 18" />, className);

export const ClockIcon = ({ className }: IconProps) =>
  svg(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>,
    className,
  );

export const ExternalIcon = ({ className }: IconProps) =>
  svg(
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5 11 13" />
      <path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />
    </>,
    className,
  );

export const PrinterIcon = ({ className }: IconProps) =>
  svg(
    <>
      <path d="M7 8V4h10v4" />
      <rect x="5" y="8" width="14" height="8" rx="1.5" />
      <path d="M8 16h8v4H8z" />
    </>,
    className,
  );

export const TypeIcon = ({ className }: IconProps) =>
  svg(
    <>
      <path d="M5 19h4M9 19 12 6h0L15 19M15 19h4M8.2 13h7.6" />
    </>,
    className,
  );

export const MailIcon = ({ className }: IconProps) =>
  svg(
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </>,
    className,
  );
