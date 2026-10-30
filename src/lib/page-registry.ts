import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "~/i18n";

export type { Locale };

export type PageKey =
  | "about"
  | "services"
  | "blog-index"
  | "case-studies-index"
  | "team"
  | "events-index"
  | "contact"
  | "privacy"
  | "imprint"
  | "careers-index";

export type CollectionName =
  | "blog"
  | "team"
  | "pages"
  | "careers"
  | "events"
  | "caseStudies";

export interface PageEntry {
  key: PageKey;
  slug: { de: string };
  component: () => Promise<{ default: unknown }>;
  noindex?: boolean;
}

// ---------------------------------------------------------------------------
// Route match discriminated union
// ---------------------------------------------------------------------------

export type StaticPageMatch = { kind: "static-page"; entry: PageEntry };

export type CollectionDetailMatch = {
  kind: "collection-detail";
  collection: CollectionName;
  entry:
    | CollectionEntry<"blog">
    | CollectionEntry<"pages">
    | CollectionEntry<"careers">
    | CollectionEntry<"events">
    | CollectionEntry<"caseStudies">;
};

export type RouteMatch = StaticPageMatch | CollectionDetailMatch;

// ---------------------------------------------------------------------------
// Static pages
// ---------------------------------------------------------------------------

export const PAGES = [
  {
    key: "about" as const,
    slug: { de: "ueber-mich" },
    component: () => import("~/components/pages/about.astro"),
  },
  {
    key: "services" as const,
    slug: { de: "vortraege" },
    component: () => import("~/components/pages/services.astro"),
  },
  {
    key: "blog-index" as const,
    slug: { de: "blog" },
    component: () => import("~/components/pages/blog-index.astro"),
  },
  {
    key: "case-studies-index" as const,
    slug: { de: "referenzen" },
    component: () => import("~/components/pages/case-studies-index.astro"),
  },
  {
    key: "contact" as const,
    slug: { de: "kontakt" },
    component: () => import("~/components/pages/contact.astro"),
  },
  {
    key: "privacy" as const,
    slug: { de: "datenschutz" },
    component: () => import("~/components/pages/privacy.astro"),
  },
  {
    key: "imprint" as const,
    slug: { de: "impressum" },
    component: () => import("~/components/pages/imprint.astro"),
  },
] satisfies PageEntry[];

// ---------------------------------------------------------------------------
// Collection → registry key mapping
// ---------------------------------------------------------------------------

const COLLECTION_REGISTRY_KEY: Record<CollectionName, PageKey> = {
  blog: "blog-index",
  team: "team",
  pages: "about", // pages collection detail routes nest under about
  careers: "careers-index",
  events: "events-index",
  caseStudies: "case-studies-index",
};

// ---------------------------------------------------------------------------
// Helpers for static pages
// ---------------------------------------------------------------------------

export function findPageByKey(key: PageKey): PageEntry | undefined {
  return PAGES.find((p) => p.key === key);
}

export function findPageBySlug(
  lang: Locale,
  slug: string,
): PageEntry | undefined {
  return PAGES.find((p) => p.slug[lang] === slug);
}

// ---------------------------------------------------------------------------
// Collection detail paths
// ---------------------------------------------------------------------------

type AnyCollectionEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"pages">
  | CollectionEntry<"careers">
  | CollectionEntry<"events">
  | CollectionEntry<"caseStudies">;

type CollectionDetailPath = {
  params: { path: string };
  props: {
    kind: "collection-detail";
    lang: Locale;
    slug: string;
    collection: CollectionName;
    entry: AnyCollectionEntry;
  };
};

/** Route param for the apex catch-all: single-locale site, no prefix. */
function toPathParam(_lang: Locale, slug: string): string {
  return slug;
}

/** Pushes detail paths for a single collection into `paths`. */
function pushDetailPaths(
  paths: CollectionDetailPath[],
  collectionName: CollectionName,
  entries: AnyCollectionEntry[],
  locales: Locale[],
): void {
  const registryKey = COLLECTION_REGISTRY_KEY[collectionName];
  const pageEntry = findPageByKey(registryKey);

  for (const entry of entries) {
    // Entry IDs from the glob loader are like "de/welcome" or "en/about".
    const slashIndex = entry.id.indexOf("/");
    if (slashIndex === -1) continue;

    const entryLocale = entry.id.slice(0, slashIndex) as Locale;
    const entrySlug = entry.id.slice(slashIndex + 1);

    if (!locales.includes(entryLocale)) continue;

    const parentSlug = pageEntry?.slug[entryLocale] ?? registryKey;
    const fullSlug = `${parentSlug}/${entrySlug}`;

    paths.push({
      params: { path: toPathParam(entryLocale, fullSlug) },
      props: {
        kind: "collection-detail",
        lang: entryLocale,
        slug: fullSlug,
        collection: collectionName,
        entry,
      },
    });
  }
}

export async function getCollectionDetailPaths(): Promise<
  CollectionDetailPath[]
> {
  const locales: Locale[] = ["de"];
  const paths: CollectionDetailPath[] = [];

  // Team has no detail pages — shown on team index only.
  // Pages collection is consumed by static page components, not routed independently.
  const blog = await getCollection("blog");
  pushDetailPaths(paths, "blog", blog, locales);

  const careers = await getCollection("careers");
  pushDetailPaths(paths, "careers", careers, locales);

  const eventsEntries = await getCollection("events");
  pushDetailPaths(paths, "events", eventsEntries, locales);

  const caseStudies = await getCollection("caseStudies");
  pushDetailPaths(paths, "caseStudies", caseStudies, locales);

  return paths;
}

// ---------------------------------------------------------------------------
// getAllPaths — static + collection detail
// ---------------------------------------------------------------------------

type StaticPagePath = {
  params: { path: string };
  props: { kind: "static-page"; lang: Locale; slug: string };
};

export async function getAllPaths(): Promise<
  Array<StaticPagePath | CollectionDetailPath>
> {
  const staticPaths: StaticPagePath[] = [];
  for (const entry of PAGES) {
    staticPaths.push({
      params: { path: toPathParam("de", entry.slug.de) },
      props: { kind: "static-page", lang: "de", slug: entry.slug.de },
    });
  }

  const detailPaths = await getCollectionDetailPaths();
  return [...staticPaths, ...detailPaths];
}
