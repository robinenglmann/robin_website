import type { Locale } from "~/i18n";

export interface Appearance {
  /** Name of the event or format. */
  event: string;
  /** Organizer or host. */
  host: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  city: string;
  talk: string;
  /** Public source that documents the appearance (program, agenda, report). */
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface VideoAppearance {
  /** 11-char YouTube video ID. */
  videoId: string;
  title: string;
  channel: string;
}

const appearances: Record<Locale, Appearance[]> = {
  de: [
    {
      event: "Produktionsfit 2026 – Digitale Produktion",
      host: "Institut Digital Production Management (IDPM), Hochschule Ansbach",
      date: "2026-07-22",
      city: "Ansbach",
      talk: "Digitale Transformation im Mittelstand: Die echten Pain Points und wie sie die Digitalisierung hemmen",
      sourceUrl: "https://www.endlich.it/produktionsfit-2026/",
      sourceLabel: "Veranstaltungsbericht",
    },
    {
      event: "Offenes FVI-Treffen bei der DEUTZ AG",
      host: "Forum Vision Instandhaltung (FVI)",
      date: "2025-09-09",
      city: "Köln",
      talk: "Digitale Transformation in der Technik (Instandhaltung): Die echten Pain Points und wie sie die Digitalisierung hemmen",
      sourceUrl:
        "https://www.ipih.de/system/files/upload/2025/termin/agenda_fvi_treffen_09.09.2025.pdf",
      sourceLabel: "Agenda (PDF)",
    },
    {
      event: "automatica 2025",
      host: "Messe München, Rahmenprogramm",
      date: "2025-06-27",
      city: "München",
      talk: "Digitale Transformation im Mittelstand",
      sourceUrl:
        "https://automatica-munich.com/de/event-programm/rahmenprogramm/sprecher/robin-englmann-6594/",
      sourceLabel: "Sprecherprofil",
    },
  ],
};

const videos: Record<Locale, VideoAppearance[]> = {
  de: [
    {
      videoId: "U3LhlVTYafs",
      title:
        "Das FVI-Expertenfrühstück – Folge 21: Arbeitssicherheit neu gedacht",
      channel:
        "Forum Vision Instandhaltung – Gesprächsrunde zur Arbeitssicherheit",
    },
  ],
};

/** Appearances sorted newest first. */
export function getAppearances(locale: Locale): Appearance[] {
  return [...appearances[locale]].sort((a, b) => b.date.localeCompare(a.date));
}

export function getVideos(locale: Locale): VideoAppearance[] {
  return videos[locale];
}
