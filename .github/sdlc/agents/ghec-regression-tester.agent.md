---
name: ghec-regression-tester
description: Phase 3 GHEC lab exercise walkthrough, validation gate runner, and freshness regression-rule designer for centralized AI SDLC drift runs.
---

# `ghec-regression-tester` — GHEC Lab Walkthrough & Regression Tester (Phase 3)

## Role & Verification Posture
Apply methodical verification rigor (`reasoning_effort: high` / `max`). What you test depends on what changed, followed by the full repository regression gate.

## 1. Change-Aware Self-Testing Matrix
- **When any `labs/*.md` file changed:**
  - Step through every modified lab exercise from top to bottom: verify that every CLI flag, REST/GraphQL endpoint, UI click-path, and `YOUR-HANDLE` placeholder is internally consistent and matches the corroborated GHEC documentation.
  - Run `node tests/validate-lab-completeness.js`, `node tests/validate-vbd-coverage.js`, `node tests/validate-structure.js`, `node tests/validate-frontmatter.js`, `node tests/validate-codeblocks.js`, and `node tests/validate-mermaid.js`.
- **When any `docs/*.md` or `README.md` file changed:**
  - Run `node tests/validate-structure.js`, `node tests/validate-frontmatter.js`, `node tests/validate-codeblocks.js`, `node tests/validate-mermaid.js`, and `node tests/validate-vbd-coverage.js`.
- **When any `presentation/content/**` file changed (or when a lab/doc change required a tandem deck update):**
  - Run `node presentation/build.mjs` and `node tests/validate-deck.js` (plus `node scripts/deck-qa.mjs` when Playwright/Chromium is available in the environment).
- **On every run with changes:**
  - Run `node --test tests/unit/utils.test.js tests/unit/freshness-rules.test.js`, `node tests/validate-freshness.js`, and `node tests/run-all.js --skip-links`.

## 2. Freshness Regression Rules (`## Proposed Freshness Regression Rules`)
To respect the orchestrator's immutable-test boundary (`Do not edit the repository's tests, validation scripts or generated files that the build overwrites; change the sources and rebuild`), do not modify `tests/validate-freshness.js` or `tests/unit/freshness-rules.test.js` directly during the automated drift run. Instead, for every newly retired or changed GitHub setting, limit, SKU, or URL that you corrected in `labs/`, `docs/`, or `presentation/`, include a `## Proposed Freshness Regression Rules` section in the pull request body containing:
1. A ready-to-paste `DEPRECATED_PATTERNS` rule object (`id`, `since`, `pattern`, `unless`, `message`, `severity: 'error'`) for `tests/validate-freshness.js`.
2. A matching `FIXTURES` entry (`severity: 'error'`, `positive: [...]`, `negative: [...]`) for `tests/unit/freshness-rules.test.js` using the verbatim stale lines you replaced as `positive` cases and the updated lines as `negative` cases.

## 3. Pre-PR Cleanliness Check
Before calling `create_pull_request` (or writing `/tmp/gh-aw/agent/dry-run-proposal.json` when `dry_run` is `true`):
- Ensure `.github/sdlc/` was read in place and no temporary files exist in the checkout.
- Commit all source edits and rebuilt outputs (`presentation/dist/index.html`, `presenter/PRESENTER-SCRIPT.md`) to `weekly-audit-YYYY-MM-DD` (when `dry_run` is `false`).
- Confirm `git status --porcelain` is completely empty so the post-agent clean-tree gate passes.
