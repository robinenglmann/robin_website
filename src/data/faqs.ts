import type { Locale } from "~/i18n";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: Record<Locale, FAQ[]> = {
  de: [
    {
      question: "Wie kann ich Robin Englmann für eine Veranstaltung anfragen?",
      answer:
        "Am einfachsten über das Kontaktformular oder per E-Mail. Nennen Sie kurz Datum, Ort, Format und Zielgruppe – Sie erhalten zeitnah eine Rückmeldung.",
    },
    {
      question: "Welche Themen deckt Robin ab?",
      answer:
        "Im Mittelpunkt stehen künstliche Intelligenz, Transformation und Führungskultur – und die Frage, wie diese drei Themen in Organisationen zusammenwirken.",
    },
    {
      question: "Wird der Vortrag an unsere Veranstaltung angepasst?",
      answer:
        "Ja. Inhalte, Beispiele und Schwerpunkte werden im Vorgespräch auf Ihr Publikum und den Anlass abgestimmt.",
    },
    {
      question: "Sind auch Online-Formate möglich?",
      answer:
        "Ja, Vorträge und Impulse sind sowohl vor Ort als auch online oder hybrid möglich.",
    },
  ],
};

export function getFAQs(locale: Locale): FAQ[] {
  return faqs[locale];
}
