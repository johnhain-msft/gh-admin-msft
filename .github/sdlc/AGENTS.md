# Remote SDLC Agent Harness — `johnhain-msft/gh-admin-msft`

> **Isolation boundary (Remote-Only):** This file and the profiles under `.github/sdlc/agents/` live inside `.github/sdlc/` rather than the repository root (`AGENTS.md`) or `.github/agents/`. Local Copilot CLI and VS Code sessions ignore `.github/sdlc/`, so local interactive work in `gh-admin-msft` is never affected. Only the centralized `drift-gh-admin-msft` cloud agent workflow in `johnhain-msft/mfg_msft_ai_sdlc` loads and follows this harness in place. **Never copy these files to `AGENTS.md` or `.github/agents/`.**

## 1. Model-Family & Reasoning-Effort Rules of Thumb

Workflow frontmatter in the centralized orchestrator intentionally keeps `engine: { id: copilot, copilot-sdk: true }` unpinned to a specific point-in-time model ID so compiled `.lock.yml` files never break when model generations advance. Instead, select model capability and reasoning effort dynamically by the properties of each phase:

| Task Phase & Properties | Model Family & Tier | Reasoning Effort | Why |
|---|---|---|---|
| **Phase 1 — Source Verification & Drift Adjudication**<br>Cross-referencing GitHub Changelog posts against primary `docs.github.com/en/enterprise-cloud@latest/*` pages, resolving policy-inheritance edge cases, and verifying exact UI click-paths, SKU splits, billing units, and numeric limits. | **Frontier Reasoning / Deep-Thinking Model**<br>(e.g., latest Claude Opus or latest high-reasoning GPT thinking tier) | `high` / `max` | Prevents false-positive curriculum churn, catches dated/conditional rollout rules (such as Unconfigured vs Default policy inheritance), and refuses uncorroborated claims. |
| **Phase 2 — Coordinated Curriculum, Deck & Script Authoring**<br>Updating `labs/lab01.md`–`labs/lab18.md`, `docs/01-*.md`–`docs/30-*.md`, `presentation/content/slides/*.md`, and `presentation/content/script/*.md` in lockstep, then rebuilding `presentation/dist/index.html` and `presenter/PRESENTER-SCRIPT.md`. | **Frontier Coding & Structured Authoring Model**<br>(e.g., latest Claude Sonnet or latest GPT coding tier) | `high` | Excels at multi-file edits across Markdown labs, reference tables, sparse HTML/Markdown slide sources, and read-aloud presenter scripts while keeping the 180-minute per-day agenda invariant intact. |
| **Phase 3 — Change-Aware Self-Testing & Freshness Rule Design**<br>Stepping through modified lab exercises and commands, running structural/deck/freshness validators, and designing regex + positive/negative fixture pairs for newly retired claims. | **Methodical Verification & QA Model**<br>(e.g., latest GPT verification/coding tier or Claude Opus) | `high` / `max` | Ensures every modified lab exercise is walkable, every validator passes with zero uncommitted artifacts, and every newly retired claim is paired with a tested regression pattern. |

## 2. Pinned Three-Phase Agent Pipeline

Execute every `drift-gh-admin-msft` run through these three specialist roles in strict order:

1. **`.github/sdlc/agents/ghec-source-verifier.agent.md` (`ghec-source-verifier`)**
   - Reads `/tmp/gh-aw/agent/sources/manifest.json` and all 7 watched GHEC source snapshots (`changelog`, `changelog/label/enterprise`, `admin`, `billing`, `copilot`, `code-security`, `actions`).
   - Corroborates every candidate change via `microsoft-learn`, `context7`, and `web-fetch` against `https://docs.github.com/en/enterprise-cloud@latest/*`.
   - Produces an explicit evidence table mapping each corroborated change to the exact files in `labs/`, `docs/`, and `presentation/content/` that require updates.
2. **`.github/sdlc/agents/ghec-curriculum-updater.agent.md` (`ghec-curriculum-updater`)**
   - Applies full, source-backed updates to lab prose, step-by-step exercises, CLI/API commands, reference docs (`docs/01-*.md`–`docs/30-*.md`), slide sources (`presentation/content/slides/*.md`), and speaker script sources (`presentation/content/script/*.md`).
   - Runs `node presentation/build.mjs` so `presentation/dist/index.html` and `presenter/PRESENTER-SCRIPT.md` stay byte-synchronized with `presentation/content/`.
3. **`.github/sdlc/agents/ghec-regression-tester.agent.md` (`ghec-regression-tester`)**
   - Steps through every modified lab exercise and command to verify pedagogical and technical completeness.
   - Runs the change-appropriate and full validation suites via `node` (`validate-lab-completeness.js`, `validate-vbd-coverage.js`, `validate-structure.js`, `validate-frontmatter.js`, `validate-codeblocks.js`, `validate-mermaid.js`, `validate-deck.js`, `scripts/deck-qa.mjs`, `validate-freshness.js`, and `tests/run-all.js --skip-links`).
   - Drafts exact `DEPRECATED_PATTERNS` and `FIXTURES` blocks in the pull request summary (`## Proposed Freshness Regression Rules`) for any newly retired or changed GitHub setting, limit, SKU, or URL.

## 3. Hard Governance Guardrails

- **No auto-merge (`auto-merge: false`):** All changes must be proposed as a pull request for human review via `create_pull_request`. Never merge or push directly.
- **Tandem curriculum + deck updates:** Whenever a lab or reference document updates a setting, limit, SKU, or UI click-path that also appears in the teaching deck or presenter script, update `presentation/content/slides/*.md` and `presentation/content/script/*.md` in the same commit and rebuild with `node presentation/build.mjs`.
- **Clean working tree before completion:** Commit all modified source files and rebuilt outputs (`presentation/dist/index.html`, `presenter/PRESENTER-SCRIPT.md`) before calling `create_pull_request` so `test -z "$(git status --porcelain)"` exits `0`.
