import type { SVGProps } from "react";

export function EchoSyncLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-2 0-4-1-4.5-2.5-.5-1.5 0-3 2.5-4C12.5 14 14 12.5 14 10c0-2.5-2-4-4-4S6 7.5 6 10" />
      <path d="M12 22c2 0 4-1 4.5-2.5.5-1.5 0-3-2.5-4-2.5-1-4-2.5-4-4 0-2.5 2-4 4-4s4 1.5 4 4" />
      <path d="M4 10c0-3 2-5 4-5" />
      <path d="M20 10c0-3-2-5-4-5" />
    </svg>
  );
}
