import type { Locale } from "~/i18n";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

// Stimmen von Veranstaltern. Die Startseite blendet den Bereich aus,
// solange die Liste leer ist.
const testimonials: Record<Locale, Testimonial[]> = {
  de: [],
};

export function getTestimonials(locale: Locale): Testimonial[] {
  return testimonials[locale];
}
