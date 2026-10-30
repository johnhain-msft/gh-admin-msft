---
section: Welcome
day: 1
---

@id: cover
@layout: title
@minutes: 1

# GitHub Enterprise Cloud Administration

Enterprise · Security · Productivity · Collaboration · AI

{{Level 300 · Two days · Three hours a day · Remote, hands-on}}

---

@id: welcome
@layout: default
@minutes: 4

# Two days, one goal

:::big
Run a GitHub Enterprise Cloud environment that is **secure, governed and still fast to work in**.
:::

:::cards 3
:::card Who is here
Enterprise owners, organization owners, repository administrators. You already use GitHub daily.
:::card How we work
Short presentation blocks, then a lab. Ask in chat any time. Cameras on if you can.
:::card What you leave with
A repository of labs and reference docs, a reference card, and a 30-day action plan you write yourself.
:::

---

@id: objectives
@layout: default
@minutes: 3

# What you will be able to do

:::cols 1fr 1fr
:::col Day 1 · Enterprise, organization, governance
- Tell the GitHub Enterprise platforms apart and know what each one bills
- Read the permission flow from enterprise policy to repository role
- Govern Copilot and AI agents from the enterprise AI controls
- Structure organizations, teams and enterprise teams on purpose
- Audit what happened, and reclaim licenses from dormant users
:::col Day 2 · Repository, security, API, automation
- Replace branch protection with rulesets, at repository and organization scope
- Turn on Secret Protection, Code Security and Dependabot at scale, and know what they cost
- Choose the right credential: PAT, OAuth app, GitHub App, `GITHUB_TOKEN`
- Script administration with the REST API, GraphQL and the `gh` CLI
- Govern Actions: runners, policies and the 2026 supply-chain controls
:::

:::callout note Mapped to Exam GH-100
The GitHub Enterprise Administrator exam domains changed in July 2026. Each section header names the domain it serves.
:::

---

@id: agenda
@layout: default
@minutes: 2

# Agenda

:::cols 1fr 1fr
:::col Day 1 · 180 minutes
- Welcome and environment check
- Enterprise overview: platforms, plans, billing
- Permission flow: roles, visibility, base permissions
- Enterprise administration and AI controls · **Lab 15**
- Organizations, users, SSO and credentials
- Teams, nested teams, team sync · **Lab 9**
- Audit log and dormant users · **Lab 8**
:::col Day 2 · 180 minutes
- Repository governance and templates · **Lab 4**
- Rulesets deep dive · **Labs 3 and 6**
- Security in the cloud and the cost model · **Lab 7**
- API and authentication · **Lab 5**
- Actions, automation and Marketplace · **Lab 13**
- Privacy, licenses, repository health
- Top five, extension labs, resources
:::

:::aside
Press [[A]] at any time for the timed agenda in your own time zone.
:::

---

@id: setup
@layout: default
@minutes: 5
@lab: Setup

# Environment check

:::cols 1.1fr 1fr
:::col Run these now
```bash
gh --version
gh auth status
git --version
```
Token scopes you want to see: `admin:org`, `repo`, `workflow`, and `read:enterprise` if you have an enterprise.
:::col Write down
- Your workshop organization name. Every lab calls it `YOUR-ORG`.
- Your GitHub handle. Labs prefix shared objects with `YOUR-HANDLE` so nobody collides.
- Whether you are an **organization owner** only, or also an **enterprise owner**. Several labs have a path for each.
:::

:::callout tip Stuck?
`labs/setup.md` has the troubleshooting table: `gh` not found, not logged in, proxies that block `api.github.com`. Fix it during the first presentation block; the first lab is an hour away.
:::
