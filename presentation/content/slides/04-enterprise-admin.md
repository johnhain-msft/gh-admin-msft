---
section: Enterprise administration
day: 1
---

@id: sec-enterprise-admin
@layout: section
@minutes: 1

# Enterprise administration

:::chips
- Settings walkthrough
- AI controls
- Copilot policies and defaults
- Seats, budgets, content exclusions
:::

{{GH-100 · Administer the environment · Secure SDLC and compliance}}

---

@id: enterprise-walkthrough
@layout: default
@minutes: 5

# Enterprise settings walkthrough

:::callout demo Share your screen on your enterprise account
We start where you have concerns, then walk every tab. Nothing is changed during the walkthrough.
:::

:::cards 4
:::card Organizations · People
- Enterprise teams, enterprise roles, **unaffiliated users**
- Dormant users and license reports
:::card Policies
- Member privileges, repositories, **deploy keys** (disabling disables existing ones)
- Personal access tokens: restrict classic, approve fine-grained, lifetimes (366-day default)
- Actions: SHA pinning, blocking, **workflow execution protections**
- Code Quality policy (2026-03-03)
:::card Settings · Authentication security
- Security contact email; profile names next to handles
- Enterprise access restrictions; IP allow list incl. EMU namespaces
- **Credentials**: inventory, CSV export (2026-09-21), bulk revocation
- Automated SSO authorization; proof of presence (preview)
- GitHub Apps: enterprise-owned, enterprise installations (GA)
:::card Compliance and the rest
- **AI controls** (GA 2026-02-26)
- Billing and licensing · Security & quality · Insights
- Identity provider (EMU)
- GitHub Connect
:::

---

@id: ai-controls
@layout: default
@minutes: 4

# AI controls · the agent control plane

:::cols 1.1fr 1fr
:::col What lives here
- **Copilot policies**: features and clients, models
- **Agents**: Copilot cloud agent, code review, third-party agents
- **MCP** server policies and an enterprise allowlist from a central registry URL (preview)
- **Managed settings**: `copilot/managed-settings.json` in the configuration source's `.github-private` (GA 2026-07-01)
- **Audit**: every entry carries `actor_is_agent`; `agent_session.task` records agent runs
- Delegate with *View* or *Manage enterprise AI controls* on a custom role
:::col Dated changes
:::timeline
2026-08-26 | Global model policy GA: unconfigured models follow the default, which is **on** | done
2026-09-28 | Copilot code review "Default" effort means Balanced | done
2026-09-28+ | Unified Copilot experience: Chat on github.com, Mobile and cloud agent under one default-on policy | watch
2026-10-22 | **Default policy for new features** took effect: GA features left Unconfigured follow it, and it ships Enabled | done
:::
:::

---

@id: copilot-policies
@layout: default
@minutes: 3

# Copilot policies: decide the defaults, then the features

:::cols 1fr 1fr
:::col Two defaults now govern what you did not configure
- **Default availability for released models** · on since 2026-08-26. Excludes open-weight models and models outside GitHub's retention agreement
- **Default policy for new features** · in effect since 2026-10-22. Set it to Disabled, or configure each feature explicitly, if "unconfigured" must mean off
- Base model for organizations that approved nothing: **GPT-5.3-Codex**, LTS through 2027-02-04
:::col Review before you enable
- Public code matching: block unless legal says otherwise
- Copilot cloud agent, agent mode, MCP servers: security review first
- Third-party agents (preview), Copilot Memory, *Store local sessions in the Cloud*
- BYOK in VS Code and Copilot vision are **on by default**; org-billed Copilot CLI bypasses user budgets
:::

:::callout warn Policies decide *who gets a feature*. Managed settings decide *how clients behave*: bypass mode, MCP allow and deny lists, default model, OpenTelemetry export, agent permissions. Doc 29 and Lab 17.
:::

---

@id: copilot-seats
@layout: default
@minutes: 2

# Seats, budgets and content exclusions

:::cards 3
:::card Assignment
- All members, selected members or teams, direct enterprise assignment (users or enterprise teams), self-service requests
- **Automatic seat reclamation** after 30+ days of inactivity
- Start with pilot teams, expand on usage data
:::card [warn] Spend
- Business 1,900 and Enterprise 3,900 included AI Credits a user a month, pooled
- Per-user and cost-center budgets, pools, expiry dates, budget-increase requests (not for EMU)
- Code review uses Actions minutes on private repositories
:::card Content exclusions
- Glob patterns: `.env`, `secrets/**`, `*.pem`, `terraform.tfvars`
- Up to 30 minutes to propagate
- Enforced in IDE completions, chat, CLI, the Copilot app and code review; **not** in agent mode or edit mode, nor for third-party agents
- Enterprise exclusions cannot be overridden by organizations
:::

---

@id: lab15
@layout: lab
@minutes: 15
@lab: 15

# Lab 15 · Copilot governance configuration

:::labtile
15 | 15 minutes | labs/lab15.md
:::

:::cols 1fr 1fr
:::col You will
- Read the enterprise and organization Copilot policies, and record what *Unconfigured* now means
- Review seat assignment and reclamation settings
- Add a content exclusion and check where it applies
- Query seats and usage with `gh api`
:::col Done when
- You can state the two defaults and their current values
- A content exclusion exists for a sensitive path
- `gh api /orgs/YOUR-ORG/copilot/billing/seats` returns your seats
:::

:::callout tip Organization owners without enterprise access
The lab's organization path covers every step. Enterprise AI controls are read with your instructor's screen share.
:::

---

@id: break1
@layout: break
@minutes: 10

# Break

Ten minutes. Back at the time on the agenda.

{{Press [[A]] for the agenda · [[B]] blanks the screen}}
