export function buildEnquiryMessage(params: {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  isEntireProperty: boolean;
  roomNames: string[];
}): string {
  const lines = [
    "Hello, I'd like to enquire about booking at Amodh.",
    "",
    "Stay Details:",
    `Check-in: ${params.checkIn}`,
    `Check-out: ${params.checkOut}`,
    `Guests: ${params.guestCount}`,
    "",
    "Selection:",
  ];

  if (params.isEntireProperty) {
    lines.push("- Entire Property");
  } else {
    for (const name of params.roomNames) {
      lines.push(`- ${name}`);
    }
  }

  lines.push("", "Please let me know availability and pricing.");
  return lines.join("\n");
}

/** Digits only, suitable for wa.me/<number> */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function whatsappEnquiryUrl(number: string, message: string): string {
  const n = normalizeWhatsAppNumber(number);
  const text = encodeURIComponent(message);
  return `https://wa.me/${n}?text=${text}`;
}
