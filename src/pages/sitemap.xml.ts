import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import {
  PAGES,
  findPageByKey,
  type CollectionName,
  type PageKey,
} from "~/lib/page-registry";
import { getLocalizedPath, type Locale } from "~/i18n";

const LOCALE: Locale = "de";

function buildUrl(site: URL, slug: string): string {
  const base = site.href.replace(/\/$/, "");
  return `${base}${getLocalizedPath(slug, LOCALE)}`;
}

function renderUrlBlock(loc: string): string {
  return `  <url>
    <loc>${loc}</loc>
  </url>`;
}

function collectStaticBlocks(site: URL): string[] {
  const blocks: string[] = [renderUrlBlock(buildUrl(site, ""))];

  for (const page of PAGES) {
    if ("noindex" in page && page.noindex) continue;
    blocks.push(renderUrlBlock(buildUrl(site, page.slug.de)));
  }

  return blocks;
}

type AnyEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"careers">
  | CollectionEntry<"events">
  | CollectionEntry<"caseStudies">;

const COLLECTION_REGISTRY_KEY: Record<CollectionName, PageKey> = {
  blog: "blog-index",
  team: "team",
  pages: "about",
  careers: "careers-index",
  events: "events-index",
  caseStudies: "case-studies-index",
};

function collectCollectionBlocks(
  site: URL,
  collectionName: CollectionName,
  entries: AnyEntry[],
): string[] {
  const pageEntry = findPageByKey(COLLECTION_REGISTRY_KEY[collectionName]);
  // Collections without an index page have no routed detail pages either.
  if (!pageEntry) return [];

  const blocks: string[] = [];
  for (const entry of entries) {
    if (!entry.id.startsWith(`${LOCALE}/`)) continue;
    const entrySlug = entry.id.slice(entry.id.indexOf("/") + 1);
    blocks.push(
      renderUrlBlock(buildUrl(site, `${pageEntry.slug.de}/${entrySlug}`)),
    );
  }
  return blocks;
}

export const GET: APIRoute = async ({ site }) => {
  // `site` is set in astro.config.mjs; this fallback only guards local/test
  // runs without it. Mirrors the config default rather than any brand domain.
  const siteUrl = site ?? new URL("https://example.com");

  const [blog, careers, events, caseStudies] = await Promise.all([
    getCollection("blog"),
    getCollection("careers"),
    getCollection("events"),
    getCollection("caseStudies"),
  ]);

  const urlBlocks: string[] = [
    ...collectStaticBlocks(siteUrl),
    ...collectCollectionBlocks(siteUrl, "blog", blog),
    ...collectCollectionBlocks(siteUrl, "careers", careers),
    ...collectCollectionBlocks(siteUrl, "events", events),
    ...collectCollectionBlocks(siteUrl, "caseStudies", caseStudies),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
