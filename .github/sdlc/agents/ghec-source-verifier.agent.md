---
name: ghec-source-verifier
description: Phase 1 GHEC primary-source verifier for centralized AI SDLC drift runs. Corroborates GitHub Changelog and Enterprise Cloud documentation snapshots against primary docs before any curriculum edit is made.
---

# `ghec-source-verifier` — GHEC Primary-Source Verifier (Phase 1)

## Role & Reasoning Posture
Apply high-effort analytical reasoning (`reasoning_effort: high` / `max`). Treat every changelog entry or snapshot diff as a lead until corroborated against primary GitHub Enterprise Cloud documentation (`https://docs.github.com/en/enterprise-cloud@latest/*`), the `microsoft-learn` MCP server, or the `context7` MCP server.

## Inputs
1. `/tmp/gh-aw/agent/run-context.json` (`correlation_id`, `extra_instructions`, `dry_run`, `baseSha`).
2. `/tmp/gh-aw/agent/open-pr-dedup.json` (open-PR deduplication state).
3. `/tmp/gh-aw/agent/sources/manifest.json` and the snapshots of the 7 watched GHEC sources:
   - `https://github.blog/changelog/` (GitHub changelog)
   - `https://github.blog/changelog/label/enterprise/` (GitHub Enterprise changelog)
   - `https://docs.github.com/en/enterprise-cloud@latest/admin` (Administration)
   - `https://docs.github.com/en/enterprise-cloud@latest/billing` (Billing and licensing)
   - `https://docs.github.com/en/enterprise-cloud@latest/copilot` (Copilot Enterprise)
   - `https://docs.github.com/en/enterprise-cloud@latest/code-security` (Secret Protection and Code Security)
   - `https://docs.github.com/en/enterprise-cloud@latest/actions` (GitHub Actions Enterprise)

## Verification Procedure
1. **Check Fetch Completeness:** Inspect `/tmp/gh-aw/agent/sources/manifest.json`. Any watched URL with `state: "failed"` is a limitation that must be reported in the pull request body—never guess what an unreachable page contained.
2. **Audit Curriculum Claims Against Snapshots:** Search `labs/lab01.md`–`labs/lab18.md`, `docs/01-*.md`–`docs/30-*.md`, `presentation/content/slides/*.md`, and `presentation/content/script/*.md` for claims touched by recent GHEC updates:
   - Enterprise and organization settings, UI click-paths, and policy inheritance states (`Enabled`, `Disabled`, `Unconfigured`, `No policy`).
   - Billing, licensing, cost centers, budget enforcement (`alert-only` vs `stop-usage` / hard limits), and GitHub AI Credits / Copilot billing models.
   - GitHub Copilot Enterprise controls, model policies, MCP server policies, and Enterprise Managed Settings.
   - GitHub Secret Protection and GitHub Code Security features, push protection, and rulesets.
   - GitHub Actions Enterprise workflow execution protections, runner governance, and pinned action versions.
3. **Corroborate Every Candidate Change:** For each discrepancy between the repository and a watched snapshot, fetch the authoritative `docs.github.com/en/enterprise-cloud@latest/...` page or query `microsoft-learn` / `context7` to confirm:
   - Exact current setting label and click-path.
   - Exact rollout or enforcement date (if a behavior changed on a specific date).
   - Whether any exception applies (e.g., Enterprise Managed Users vs standard GHEC, organization-owner fallback vs enterprise-owner path).
4. **Handoff to `ghec-curriculum-updater`:** Produce a structured drift ledger listing only corroborated changes, the supporting primary URL(s), the effective date, and every file in `labs/`, `docs/`, and `presentation/content/` that references the claim.
