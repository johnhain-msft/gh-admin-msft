# Changelog

## 2026-10-29 · first release of the kit

This repository replaces two earlier sources: the public `gh-abcs-admin` fork (labs, docs, tests) and a PowerPoint-based "GitHub Administration Workshop" deck with its refresh tooling. Nothing customer-specific from either was carried over.

### Added
- **Teaching deck** `presentation/dist/index.html`: a single-file web app with a separate speaker window, staged reveals, an interactive base-permission grid, an authentication decision tree, hover-to-trace diagrams, knowledge-check quizzes, a timed agenda in any time zone, an overview grid, light and dark themes, and print-to-PDF. Built from Markdown by `presentation/build.mjs` with no dependencies.
- **Presenter script** `presenter/PRESENTER-SCRIPT.md`, generated from the same sources as the deck, written for speaking: short sentences, cue lines for what to do versus what to say, a bridge sentence into every slide, and a running clock.
- **Deck checks** in `tests/validate-deck.js` (every slide has a script, no cue text on the audience surface, each day plans 180 minutes, built artifacts present and well formed) and `scripts/deck-qa.mjs` (Playwright screenshots with overflow detection).
- **Lab run log** `labs/RUN-LOG.md`: a verified dry run of all eighteen labs with what needs a paid plan or an organization.
- Issue form, issue config and pull request template (Lab 4 artifacts).

### Changed
- Labs re-pointed to this repository; audit-log commands now use `--method GET` (without it `gh api` sends POST and the API answers 404); plan-limitation notes for rulesets, environment protection rules and Actions policies on personal Free repositories; dated statements re-read against 2026-10-29.
- Docs re-pointed from the retired PowerPoint and supplement slides to the deck and script; the Instructor Guide's slide reference now maps deck sections to docs and labs; the Copilot "Default policy for new features" (in effect since 2026-10-22) is described in the present tense.
- CI workflow runs on Node 22 and validates the deck.

### Removed
- `PRESENTER-SCRIPT-DAY1.md`, `PRESENTER-SCRIPT-DAY2.md`, `SLIDE-DECK-OUTLINE.md`, the two HTML supplement decks, `PLAN.md`, `REVIEW-RUBRIC.md`, the Jekyll configuration and Pages workflow, and the original author's CODEOWNERS entry.
