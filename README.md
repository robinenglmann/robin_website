# Robin Englmann – Speaker-Website

Website von Robin Englmann, Keynote Speaker für KI, Transformation und Führungskultur. Gebaut mit [passionfruit](https://github.com/passion4it-gmbh/passionfruit) (Astro, Tailwind CSS, TypeScript).

## Lokal starten

```bash
pnpm install
pnpm dev
```

Die Seite läuft dann unter http://localhost:4321.

## Inhalte pflegen

- Texte und Kontaktdaten: `src/i18n/de.json`
- Seiten (Über mich, Vorträge, Kontakt, Impressum, Datenschutz): `src/content/pages/de/`
- Blogartikel: `src/content/blog/de/` (oder `/new-post` in Claude Code)
- Referenzen: `src/content/caseStudies/de/`

## Staying Current

passionfruit is a one-shot template — your project is yours once it's scaffolded. But passionfruit itself keeps evolving (new components, design improvements, security fixes), and you can pull those in whenever you want.

**The Claude-driven way (recommended):**

```
Check passion4it-gmbh/passionfruit/releases for versions newer than
ours. Pull in the newsletter signup component from the latest release
and adapt it to our brand colors.
```

Claude fetches the relevant files from the latest release, adapts them to your codebase, and wires them in. You only adopt what's useful.

**The git-native way:**

```bash
git remote add upstream https://github.com/passion4it-gmbh/passionfruit.git
git fetch upstream main
git log HEAD..upstream/main --oneline       # see what's new
git cherry-pick <sha>                        # pick a specific change
```

Expect conflicts on `src/i18n/*.json`, `src/lib/page-registry.ts`, and `src/content/` — those are your business content, keep your version.

Watch [Releases](https://github.com/passion4it-gmbh/passionfruit/releases) (click "Watch" → "Custom" → "Releases" on the repo) to get notified when there's something worth adopting.

---
