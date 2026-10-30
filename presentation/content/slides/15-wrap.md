---
section: Wrap-up
day: 2
---

@id: privacy-licenses-health
@layout: default
@minutes: 5

# Privacy, licenses and repository health

:::cards 3
:::card Privacy and data residency
- GHE.com regions: **EU, Australia, US, Japan** · always EMU, no public repositories
- Copilot stays in-region only with the *data residency compliant models* policy (US, EU)
- Users control profile, private contribution counts, `noreply` email; IP disclosure is an enterprise choice
:::card [warn] Who consumes a seat
- Organization members, **outside collaborators** on private or internal repositories, dormant members, pending invitations outside EMU
- Not: **unaffiliated users**, billing managers, suspended EMU accounts
- One license per person across organizations and GHES
:::card Repository health
- Under 1 GB; files over 100 MiB are blocked
- History: `git-filter-repo`, then **Git LFS**
- Stale branches: *Automatically delete head branches*
- **Archive** keeps it read-only · **transfer** moves it · **delete** only for mistakes or secrets that cannot be purged
:::

---

@id: top5
@layout: default
@minutes: 1

# Top five things to implement this week

:::steps
1. **Organization rulesets** on `main`: pull request required, at least one review
2. **Secret Protection and push protection** organization-wide, through a security configuration
3. **Audit log streaming** to your SIEM
4. **Least-privilege review** of everyone who holds Admin
5. **SCIM provisioning** from your identity provider
:::

---

@id: extension-labs
@layout: default
@minutes: 1

# Nine self-paced labs

| Lab | Minutes | Topic |
|---|---|---|
| 1 | 10 | Repository webhooks and events |
| 2 | 15 | Actions settings for a repository |
| 10 | 20 | Dormant user management |
| 11 | 20 | GitHub Apps and Marketplace |
| 12 | 25 | Deployments and environments |
| 14 | 25 | Unhealthy repositories and Git history |
| 16 | 20–30 | Enterprise teams |
| 17 | 20–30 | Enterprise managed settings for Copilot |
| 18 | 20–30 | Workflow execution protections |

:::aside
All in `labs/`, with the same `YOUR-ORG` and `YOUR-HANDLE` conventions. Docs 20, 24, 25, 28, 29 and 30 are the background reading.
:::

---

@id: day2-quiz
@layout: quiz
@minutes: 2

# Knowledge check

:::cols 1fr 1fr
:::col
:::quiz
Q: A repository ruleset requires 1 review and an organization ruleset requires 2. A pull request targets a branch covered by both. How many reviews are required to merge?
- A) 1 — the repository-level ruleset takes precedence
- B) 2 — rulesets layer and the strictest requirement applies
- C) 3 — both rulesets stack additively
- D) The rulesets conflict and neither is enforced
Answer: B — Rulesets layer. The strictest requirement across every applicable ruleset is enforced.
:::
:::col
:::quiz
Q: What is the difference between secret scanning alerts and push protection?
- A) Alerts notify after a secret is pushed; push protection blocks the push before it happens
- B) They are the same feature with different names
- C) Push protection only works with GitHub Actions secrets
- D) Alerts only work on public repositories
Answer: A — Alerts are reactive, after the push. Push protection is proactive and refuses the push.
:::
:::

---

@id: resources
@layout: default
@minutes: 1

# Resources

:::kv
Reference card | `docs/REFERENCE-CARD.md` · URLs, `gh` commands, roles, audit events, decision matrix
GitHub Docs | `docs.github.com/en/enterprise-cloud@latest`
GitHub Changelog | `github.blog/changelog` · subscribe: this deck changed every month of 2026
GH-100 study guide | Microsoft Learn · GitHub Enterprise Administrator, skills updated July 2026
Microsoft Learn | The GitHub Administration collection
Assessment | `docs/POST-WORKSHOP-ASSESSMENT.md` · confidence checklist, feedback, action plan
:::

---

@id: qa
@layout: default
@minutes: 0

# Questions

:::center
:::big
What would you like to go back to?
:::
:::

{{Anything from Day 1 or Day 2 · chat or unmute}}

---

@id: thanks
@layout: end
@minutes: 0

# Thank you

:::big
Your **30-day action plan**: write down three things. **What**, by **when**, and **who** owns it.
:::

{{Assessment and reference card are in chat · the self-paced labs are in `labs/`}}
