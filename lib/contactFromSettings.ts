import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from "@/lib/contact-info";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export type ResolvedPublicContact = {
  telHref: string;
  phoneButtonLabel: string;
  mailtoHref: string;
  emailLabel: string;
  whatsappHref: string;
  whatsappButtonLabel: string;
};

function formatDigitsForDisplay(digits: string): string {
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return digits ? `+${digits}` : "";
}

/** tel: href — keeps leading + and digits */
export function telHrefFromInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return `tel:${CONTACT_PHONE_TEL}`;
  if (trimmed.startsWith("+")) {
    const rest = trimmed.slice(1).replace(/\D/g, "");
    return rest ? `tel:+${rest}` : `tel:${CONTACT_PHONE_TEL}`;
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `tel:${digits}` : `tel:${CONTACT_PHONE_TEL}`;
}

export function resolvePublicContact(settings: {
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
}): ResolvedPublicContact {
  const phoneRaw = settings.contact_phone?.trim() ?? "";
  const emailRaw = settings.contact_email?.trim() ?? "";

  const phoneButtonLabel = phoneRaw || CONTACT_PHONE_DISPLAY;
  const telHref = phoneRaw ? telHrefFromInput(phoneRaw) : `tel:${CONTACT_PHONE_TEL}`;

  const emailLabel = emailRaw || CONTACT_EMAIL;
  const mailtoHref = `mailto:${emailLabel}`;

  const waDigits = normalizeWhatsAppNumber(settings.whatsapp_number ?? "");
  const whatsappHref =
    waDigits.length >= 8 ? `https://wa.me/${waDigits}` : CONTACT_WHATSAPP_URL;
  const whatsappButtonLabel =
    waDigits.length >= 8
      ? `WhatsApp ${formatDigitsForDisplay(waDigits)}`
      : `WhatsApp ${CONTACT_WHATSAPP_DISPLAY}`;

  return {
    telHref,
    phoneButtonLabel,
    mailtoHref,
    emailLabel,
    whatsappHref,
    whatsappButtonLabel,
  };
}
