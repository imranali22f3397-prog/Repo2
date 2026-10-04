'use client';
import { SVGProps, ReactNode } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number; title?: string };

const wrap = (
  { size = 24, title, ...rest }: IconProps,
  children: ReactNode,
  viewBox = '0 0 24 24'
) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : 'presentation'}
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    {children}
  </svg>
);

export function HeartIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <defs>
        <linearGradient id="icon-heart" x1="4" y1="4" x2="20" y2="22">
          <stop offset="0%" stopColor="#f4a3bd" />
          <stop offset="100%" stopColor="#e0527e" />
        </linearGradient>
      </defs>
      <path
        d="M12 20.4s-7.2-4.5-7.2-9.2A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.2 2.8c0 4.7-7.2 9.2-7.2 9.2Z"
        fill="url(#icon-heart)"
        stroke="#b0345a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </>
  );
}

export function SparkleIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M12 3.2 13.4 9 19 10.4 13.4 11.8 12 17.6 10.6 11.8 5 10.4 10.6 9Z"
      fill="#f5c26b"
      stroke="#d49a3d"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  );
}

export function LockIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <defs>
        <linearGradient id="icon-lock" x1="6" y1="10" x2="18" y2="22">
          <stop offset="0%" stopColor="#f4a3bd" />
          <stop offset="100%" stopColor="#b0345a" />
        </linearGradient>
      </defs>
      <path
        d="M8 10.5V8.2a4 4 0 0 1 8 0v2.3"
        stroke="#b0345a"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect x="5.5" y="10.5" width="13" height="10" rx="2.5" fill="url(#icon-lock)" stroke="#8a2a4a" strokeWidth="1.4" />
      <circle cx="12" cy="15" r="1.4" fill="#fff7f2" />
      <path d="M12 16.3v1.6" stroke="#fff7f2" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

export function KeyIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M8.2 15.2a3.2 3.2 0 1 1 2.7-1.5L14 16.8v1.8h2.2v1.8H19v1.6h-4.6l-4.4-4.4a3.2 3.2 0 0 1-1.8-.4Z"
      fill="#f5c26b"
      stroke="#d49a3d"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  );
}

export function CalendarIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <rect x="4" y="6" width="16" height="14" rx="2.5" fill="#fff7f2" stroke="#e0527e" strokeWidth="1.6" />
      <path d="M4 10h16" stroke="#e0527e" strokeWidth="1.6" />
      <path d="M8 4v4M16 4v4" stroke="#b0345a" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1.1" fill="#e0527e" />
      <circle cx="12" cy="14" r="1.1" fill="#f4a3bd" />
      <circle cx="15" cy="14" r="1.1" fill="#f5c26b" />
    </>
  );
}

export function GiftIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="1.8" fill="#f4a3bd" stroke="#b0345a" strokeWidth="1.5" />
      <path d="M4.5 14h15M12 10v10" stroke="#b0345a" strokeWidth="1.5" />
      <path d="M8 10c0-2.4 2-3.6 4-1.6C14 6.4 16 7.6 16 10" stroke="#e0527e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

export function CameraIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.4" fill="#fff7f2" stroke="#b0345a" strokeWidth="1.6" />
      <path d="M9 7.5 10.2 5.4h3.6L15 7.5" stroke="#b0345a" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="13.2" r="3.1" fill="#f4a3bd" stroke="#e0527e" strokeWidth="1.4" />
    </>
  );
}

export function ArrowIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M5 12h12.5M13.5 7.5 18.5 12l-5 4.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function CloseIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M7 7l10 10M17 7 7 17"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  );
}

export function SpeakerIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <path d="M5 9.5h3.2L13 6v12l-4.8-3.5H5V9.5Z" fill="#f4a3bd" stroke="#b0345a" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 9.2a4 4 0 0 1 0 5.6M18.2 7.4a6.4 6.4 0 0 1 0 9.2" stroke="#e0527e" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

export function SpeakerOffIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <path d="M5 9.5h3.2L13 6v12l-4.8-3.5H5V9.5Z" fill="#f4a3bd" stroke="#b0345a" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 9l4 6M20 9l-4 6" stroke="#b0345a" strokeWidth="1.7" strokeLinecap="round" />
    </>
  );
}

export function PetalIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M12 3c4.5 4.2 6 10 0 18C6 13 7.5 7.2 12 3Z"
      fill="#f4a3bd"
      stroke="#e0527e"
      strokeWidth="1.4"
    />
  );
}

export function StarIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M12 3.5 14.1 9h5.7l-4.6 3.4 1.8 5.6L12 14.8 7 18l1.8-5.6L4.2 9h5.7L12 3.5Z"
      fill="#f5c26b"
      stroke="#d49a3d"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  );
}

export function EyeIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <path d="M3.5 12s3.2-6 8.5-6 8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6Z" stroke="#b0345a" strokeWidth="1.6" fill="#fff7f2" />
      <circle cx="12" cy="12" r="2.4" fill="#e0527e" />
    </>
  );
}

export function EyeOffIcon(props: IconProps) {
  return wrap(
    props,
    <>
      <path d="M3.5 12s3.2-6 8.5-6 8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6Z" stroke="#b0345a" strokeWidth="1.6" fill="#fff7f2" />
      <circle cx="12" cy="12" r="2.4" fill="#e0527e" />
      <path d="M5 19 19 5" stroke="#b0345a" strokeWidth="1.7" strokeLinecap="round" />
    </>
  );
}

export function QuoteIcon(props: IconProps) {
  return wrap(
    props,
    <path
      d="M6.5 16.5c1.8 0 3-1.3 3-3.1 0-1.7-1.1-2.9-2.7-3.1.4-1.8 1.8-3.3 4-4.3L9.8 4.5C6.2 6 4 8.6 4 12.3 4 14.8 5.4 16.5 7.5 16.5Zm8.2 0c1.8 0 3-1.3 3-3.1 0-1.7-1.1-2.9-2.7-3.1.4-1.8 1.8-3.3 4-4.3l-1-1.5c-3.6 1.5-5.8 4.1-5.8 7.8 0 2.5 1.4 4.2 3.5 4.2Z"
      fill="#f4a3bd"
      opacity="0.9"
    />
  );
}
