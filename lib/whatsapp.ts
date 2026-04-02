export function buildEnquiryMessage(params: {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  isEntireProperty: boolean;
  roomNames: string[];
}): string {
  const lines = [
    "Hello, I'd like to enquire about booking at Amod.",
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

/** Amod enquiry copy: room lines should include formatted prices, e.g. "Deluxe (₹2,000)". */
export function buildAmodEnquiryMessage(params: {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  isEntireProperty: boolean;
  /** Pre-formatted lines without leading bullet, e.g. "Deluxe Room (₹2,000)" */
  selectionLines: string[];
  mealsEnabled?: boolean;
  selectedMealLabels?: string[];
  roomOnlyTotalLabel?: string;
  withMealsTotalLabel?: string;
}): string {
  const lines = [
    "Hello, I'm interested in booking at Amod.",
    "",
    "Stay details:",
    `Check-in: ${params.checkIn}`,
    `Check-out: ${params.checkOut}`,
    `Guests: ${params.guestCount}`,
    "",
    "Selected:",
  ];

  for (const line of params.selectionLines) {
    lines.push(`- ${line}`);
  }

  if (
    params.mealsEnabled &&
    params.selectedMealLabels &&
    params.selectedMealLabels.length > 0
  ) {
    lines.push(
      "",
      "Meal add-ons (estimate):",
      params.selectedMealLabels.join(", ")
    );
  }

  if (params.roomOnlyTotalLabel) {
    lines.push("", `Room-only (est. per night): ${params.roomOnlyTotalLabel}`);
  }
  if (
    params.withMealsTotalLabel &&
    params.selectedMealLabels &&
    params.selectedMealLabels.length > 0
  ) {
    lines.push(
      `With selected meals (est. per night): ${params.withMealsTotalLabel}`
    );
  }

  lines.push("", "Please share availability and details.");
  return lines.join("\n");
}
