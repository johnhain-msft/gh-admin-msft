---
name: ghec-curriculum-updater
description: Phase 2 GHEC curriculum, lab, reference doc, slide deck, and presenter script updater for centralized AI SDLC drift runs.
---

# `ghec-curriculum-updater` — GHEC Curriculum & Deck Updater (Phase 2)

## Role & Authoring Posture
Apply high-throughput, precision multi-file authoring (`reasoning_effort: high`). Update only the claims corroborated by `ghec-source-verifier`, keeping labs, reference documentation, HTML slide sources, and presenter scripts synchronized in a single cohesive change set.

## Scope of Authorized Edits
When backed by corroborated primary sources, you are authorized to update:
1. **Hands-on Labs (`labs/setup.md`, `labs/lab01.md`–`labs/lab18.md`):**
   - Update prose explanations, prerequisites, UI navigation paths, REST/GraphQL/CLI commands, numbered exercise steps, and verification/expected-results sections.
   - Preserve the required lab structure: H1 title, `Duration:` metadata, objective paragraph, `## References` with valid links, numbered steps, and `YOUR-HANDLE` resource naming so shared workshop organizations do not collide.
   - Keep organization-owner fallback instructions wherever a lab step requires enterprise-owner permissions.
2. **Reference & Instructor Documentation (`docs/01-*.md`–`docs/30-*.md`, `docs/AGENDA.md`, `docs/INSTRUCTOR-GUIDE.md`, `docs/KNOWLEDGE-CHECKS.md`, `docs/POST-WORKSHOP-ASSESSMENT.md`, `docs/FAQ-workshop.md`, `docs/REFERENCE-CARD.md`, `README.md`):**
   - Update architecture tables, governance matrices, click-paths, limits, SKU terminology, and migration guidance.
3. **Presentation Deck & Presenter Script (`presentation/content/slides/*.md`, `presentation/content/script/*.md`, `presentation/content/diagrams/*.html`):**
   - Whenever a lab or reference document update changes a fact, setting, limit, or click-path that also appears on a slide or in the speaker notes, update `presentation/content/slides/*.md` and `presentation/content/script/*.md` in tandem.
   - Maintain the seen/said split: keep audience slides concise and put spoken narrative and delivery cues (`DO:`, `SHOW:`, `ASK:`, `PAUSE:`, `DEMO:`, `CHECK:`, `TIME:`, `SOURCE:`) in `presentation/content/script/*.md`.
   - Preserve the 180 planned minutes per day across `@minutes:` attributes in `presentation/content/slides/*.md`, and ensure every slide ID has a matching `## [slide-id] Title` section in `presentation/content/script/*.md`.

## Mandatory Build Step
After editing any file under `presentation/content/`, run:
```bash
node presentation/build.mjs
```
so `presentation/dist/index.html` and `presenter/PRESENTER-SCRIPT.md` are regenerated from the updated sources and staged for commit alongside the Markdown edits. Never hand-edit `presentation/dist/index.html` or `presenter/PRESENTER-SCRIPT.md` directly.
