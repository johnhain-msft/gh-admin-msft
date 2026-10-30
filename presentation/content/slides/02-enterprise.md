---
section: Enterprise overview
day: 1
---

@id: sec-enterprise
@layout: section
@minutes: 1

# Enterprise overview

:::chips
- Platforms
- Data residency and EMU
- Plans and add-on products
- Pay per use
- Budgets, cost centers, usage
:::

{{GH-100 · Administer the environment · Monitor and optimize usage}}

---

@id: platforms
@layout: default
@minutes: 4

# Three ways to run GitHub Enterprise

:::cards 3
:::card GitHub Enterprise Cloud
**github.com** · SaaS, minimal configuration, private but on the internet.
- Personal accounts, or Enterprise Managed Users
- Every new capability lands here first
- 50,000 Actions minutes a month included
:::card [purple] GHE.com · data residency
**SUBDOMAIN.ghe.com** · the same cloud, in your region.
- EU (incl. Norway and Switzerland), Australia, US, Japan
- Always EMU. No public repositories
- Codespaces and Copilot data residency available
:::card [muted] GitHub Enterprise Server
**Self-hosted** · your network, your upgrades, HA capable.
- Current release 3.22 (GA 2026-09-08)
- No Copilot, Code Quality or workflow holds
- GitHub Connect bridges selected features
:::

:::callout dated Dated changes to verify before you teach
GHE.com rejects TLS clients that offer only X25519 since **2026-10-07**. Enterprise Live Migrations from GHES to GHE.com have been GA since **2026-09-01**.
:::

---

@id: ghec
@layout: default
@minutes: 2

# GitHub Enterprise Cloud

:::cols 1.2fr 1fr
:::col The hierarchy
:::steps
- **Enterprise** · owners, policies, licenses, billing, audit log
- **Organizations** · own namespaces, settings, roles, teams
- **Teams** · group people, grant permissions, route notifications
- **Repositories** · where the work and the rules meet
:::
:::col Two kinds of account
Accounts belong to the **person** on github.com. They had the account before you hired them, and they keep it after.

With **Enterprise Managed Users** the account belongs to the enterprise, provisioned from your identity provider.
:::

:::aside
Every new enterprise lives at `github.com/enterprises/SLUG`. On GHE.com, the API moves too: `api.SUBDOMAIN.ghe.com`.
:::

---

@id: emu
@layout: default
@minutes: 3

# Enterprise Managed Users

:::cols 1fr 1fr
:::col What the IdP controls
- Usernames, profile data, team membership, repository access
- Members contribute only to private and internal repositories in **their** enterprise
- No public content, no forks outside the enterprise
- Repository collaborators replace outside collaborators
:::col Controls that arrived in 2025–2026
:::timeline
2025-09-15 | Enterprise access restrictions: your proxy injects a header so only your EMU accounts reach github.com | GA
2026-02-17 | Bulk credential deletion for incident response (EMU only) | GA
2026-06-08 | IP allow list covers EMU user-namespace repositories | GA
2026-09-24 | Proof of presence: re-authenticate with the IdP before high-impact actions (Entra ID) | Preview
:::
:::

:::callout note OIDC and Conditional Access
OIDC works with Microsoft Entra ID only. That is what lets Entra Conditional Access policies apply to GitHub sessions.
:::

---

@id: ghes
@layout: default
@minutes: 3

# GitHub Enterprise Server

:::cols 1fr 1fr
:::col Not at feature parity, on purpose
- **GitHub Copilot** is not available for GHES. 3.22 adds a technical preview of Copilot CLI with a self-configured model provider for air-gapped sites
- **GitHub Code Quality** is not on GHES
- The **Security & quality** navigation is not on GHES
- No Actions hold on potentially malicious workflows
:::col Operating it
- Keep it upgraded. GitHub rejects support bundles from appliances below 3.21.3, 3.20.5, 3.19.9, 3.18.12 or 3.17.18 (since 2026-08-18)
- Enterprise teams are GA on 3.22
- Migration paths: **Enterprise Live Migrations** to GHE.com; **GitHub Enterprise Importer** with GitHub-owned blob storage; GEI from GitLab (GA 2026-08-03)
:::

:::callout tip When Server is still the answer
Regulatory isolation that data residency cannot meet, or an air-gapped network. Otherwise the cloud is where the roadmap goes first.
:::

---

@id: plans
@layout: default
@minutes: 3

# Plans and add-on products

:::cols 1fr 1fr
:::col GitHub plans
- **GitHub Free** · github.com
- **GitHub Team** · one organization (not "Teams")
- **GitHub Enterprise** · Cloud or Server
:::col Add-on products · Team and Enterprise
- **GitHub Secret Protection** · $19 per active committer a month
- **GitHub Code Security** · $30 per active committer a month
- **GitHub Code Quality** · $10 per active committer a month, GA 2026-07-20
- **GitHub Copilot Business** · $19 a user a month
- **GitHub Copilot Enterprise** · $39 a user a month
:::

:::callout dated Copilot bills in GitHub AI Credits since 2026-06-01
Each seat includes a monthly allowance, pooled across the enterprise. Usage beyond it is billed through budgets. Code review on private repositories also uses Actions minutes.
:::

---

@id: pay-per-use
@layout: default
@minutes: 2

# Pay per use

:::cards 4
:::card Actions
GitHub-hosted runners, standard and larger, beyond included minutes. Prices cut up to 39% on 2026-01-01. Cache beyond 10 GB per repository is billed.
:::card Copilot
GitHub AI Credits beyond the included allowance. Code review on private repositories uses Actions minutes. Reviews for unlicensed contributors bill the organization.
:::card Packages and Codespaces
Packages storage and transfer. Codespaces compute while active and storage while it exists; prebuilds use Actions minutes. No free quota for organizations.
:::card Marketplace, LFS, Sponsors
Pay-per-use apps, Git LFS data packs, and GitHub Sponsors payments on the account's billing date and method.
:::

:::aside
Say the product names: GitHub Codespaces, GitHub Sponsors, GitHub Packages.
:::

---

@id: billing-mgmt
@layout: default
@minutes: 2

# Billing and licensing management

:::cards 3
:::card Budgets
- License budgets in **license counts**, not dollars (since 2025-09-02)
- **Hard limits** for GitHub Advanced Security block new license use (2026-05-28)
- Per-user AI-credit budgets; alerts at 90% and 100% of included usage
:::card Cost centers
- Up to **1,000** per enterprise (2026-06-26)
- Enterprise teams as members (2026-06-25)
- AI-credit pools cap a cost center's share of included credits (2026-07-02)
:::card Usage and APIs
- Metered usage attributed to organizations
- License history (public preview)
- Budget and usage-report APIs GA 2026-06-04; the product-specific billing APIs closed 2025-09-26
:::

:::callout warn If you still call the old billing endpoints
Move the scripts to the consolidated usage endpoint. The old ones stopped answering in September 2025.
:::
