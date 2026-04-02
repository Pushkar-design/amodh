"use client";

import { Button } from "@/components/ui/button";

type WhatsAppEnquiryButtonProps = {
  href?: string;
  disabled?: boolean;
};

export function WhatsAppEnquiryButton({
  href,
  disabled,
}: WhatsAppEnquiryButtonProps) {
  const className =
    "h-11 w-full shrink-0 rounded-xl bg-[#128C7E] px-6 font-label text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#128C7E]/90 sm:min-w-[200px] sm:flex-1";

  if (href && !disabled) {
    return (
      <Button asChild size="lg" className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          Book your stay
        </a>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      disabled
      className="h-11 w-full shrink-0 rounded-xl sm:min-w-[200px] sm:flex-1"
    >
      Book your stay
    </Button>
  );
}
