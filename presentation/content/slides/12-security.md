---
section: Security in the cloud
day: 2
---

@id: sec-security
@layout: section
@minutes: 1

# Security in the cloud

:::chips
- Three products and a free one
- Push protection
- Code scanning and Dependabot
- Security configurations
- The cost model
:::

{{GH-100 · Secure SDLC and compliance}}

---

@id: security-products
@layout: default
@minutes: 3

# What you buy, and what is free

:::cards 4
:::card [purple] GitHub Secret Protection · $19
Per active committer a month. Secret scanning, **push protection**, custom patterns, validity checks, delegated bypass, public monitoring (preview).
:::card [purple] GitHub Code Security · $30
Per active committer a month. **CodeQL** code scanning, Copilot Autofix, dependency review, security campaigns, custom Dependabot auto-triage rules.
:::card GitHub Code Quality · $10
Per active committer a month since **2026-07-20**, plus AI Credits and Actions minutes. Separate product, separate policy. Not on GHES.
:::card [good] Dependabot · free
Dependency graph, alerts, security updates, version updates, malware alerts. Every plan.
:::

:::callout dated Detector types were renamed on 2026-07-10
*Non-provider patterns* are now **Generic patterns**; *Copilot secret scanning* is now **AI-detected secrets**. Detection, webhooks, audit events and the API did not change.
:::

---

@id: push-protection
@layout: default
@minutes: 3

# Push protection

:::diagram push-protection

---

@id: code-scanning-dependabot
@layout: default
@minutes: 3

# Code scanning and Dependabot

:::cols 1fr 1fr
:::col Code scanning · CodeQL default setup
- Languages detected; runs on pull requests and weekly on active repositories
- Customize without a workflow: the **`github-codeql-config-file`** property, with an organization default (2026-08-04)
- **Agentic autofix** (preview since 2026-07-10): *Assign to Copilot* opens a draft pull request; AI Credits plus Actions minutes
- New dismissal reason **Mitigated** (2026-08-20)
:::col Dependabot
- Alerts, security updates, version updates from `dependabot.yml`
- Version updates wait **3 days** after a release (cooldown, 2026-07-14); security updates do not
- **Malware alerts**; OpenSSF advisories since 2026-07-28 reach PyPI and more
- Alerts closed 2+ years ago moved to a CSV archive on 2026-09-25
:::

---

@id: security-configurations
@layout: default
@minutes: 2

# Security configurations

:::cols 1fr 1fr
:::col One bundle, many repositories
- **GitHub recommended** or **custom**: which features, applied to all or selected repositories
- Set one as the **default for new repositories**
- Enterprise configurations push the same bundle to every organization
:::col Dated changes
:::timeline
2026-04-21 | Organization API `*_enabled_for_new_repositories` fields retired; use a default configuration | done
2026-05-28 | Hard license budgets stop GHAS being enabled on more repositories | done
2026-09-15 | Enforcement: **Enforce for repository and organization owners** | done
:::
:::

:::callout warn Unset is not enforced
A feature the configuration leaves unset is not locked at any level. Set every feature you care about explicitly, then choose the enforcement level.
:::

---

@id: ghas-cost
@layout: default
@minutes: 3

# The cost model

:::stats
$19 | Secret Protection | per active committer a month
$30 | Code Security | per active committer a month
90 days | Active committer window | counted once across the enterprise
:::

:::cols 1fr 1fr
:::col Who counts
- Anyone who pushed to an enabled repository in the last 90 days
- Once, however many repositories
- GitHub App bots excluded; PAT automation **counts**
- Public repositories: free
:::col Spend less, on purpose
- Tier 1 both products · Tier 2 Secret Protection · Tier 3 Dependabot only
- Free risk assessments every 90 days before buying
- **Hard license budgets** since 2026-05-28; alerts at 75, 90 and 100%
- Cost centers follow enterprise teams (2026-06-25)
:::

---

@id: lab07
@layout: lab
@minutes: 20
@lab: 7

# Lab 7 · Security scanning and push protection

:::labtile
7 | 20 minutes | labs/lab07.md
:::

:::cols 1fr 1fr
:::col You will · sections 7.1 to 7.4
- Enable Secret Protection and push protection in *Settings → Advanced Security*
- Push a branch with the AWS-format test key, read the block, then bypass or remove it
- Enable CodeQL default setup; keep working while it runs
- Read a Dependabot alert and the difference between security and version updates
:::col Done when
- Secret Protection and push protection show **Enabled**
- You triggered and resolved one push protection block
- One CodeQL analysis completed and alerts open
- The Dependabot alerts page loads
:::

:::callout warn Licensing first
Push protection only blocks when the organization has GitHub Secret Protection. Confirm with your instructor before you start; 7.5 auto-triage rules is optional.
:::
