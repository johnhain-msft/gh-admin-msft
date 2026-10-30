---
section: Audit log and dormant users
day: 1
---

@id: audit-overview
@layout: default
@minutes: 4

# The audit log

:::cols 1fr 1fr
:::col What it holds and for how long
- Settings, membership, repository, app, authentication, billing and Git events, across every organization at the enterprise
- **Web events: 180 days** in the UI and API
- **Git events: 7 days**, API only
- IP addresses only when an enterprise owner enables disclosure
- Agent activity: `actor_is_agent`, `agent_session.task`
:::col Searching it
```text
action:repo.create actor:admin-user created:>2026-10-01
action:org.update_member_repository_permission
action:repository_ruleset  action:protected_branch
action:enterprise_team     action:git.push
```
Qualifiers AND together. Export CSV or JSON. The API paginates with a cursor and allows 1,750 requests an hour.
:::

:::callout warn Git events last seven days
Who cloned a repository ten days ago is already gone unless you stream.
:::

---

@id: audit-streaming
@layout: default
@minutes: 3

# Streaming to your SIEM

:::cards 3
:::card Targets
Splunk · Azure Event Hubs (Sentinel) · Azure Blob Storage · Amazon S3 · Google Cloud Storage · Datadog. Two endpoints at once. No generic HTTPS target.
:::card [warn] Guarantees
At-least-once delivery, compressed JSON. Paused streams buffer **7 days**. Health checks every 24 hours; a broken stream is disabled after **6 days**.
:::card Without enterprise streaming
A scheduled workflow calls the organization audit-log API daily and archives the output. Lab 8 builds the command.
:::

:::callout tip Why it is not optional
SOC 2, FedRAMP and HIPAA retention windows exceed 180 days, and real-time alerting on `org.add_member` or a ruleset bypass only happens in a SIEM.
:::

---

@id: dormant-users
@layout: default
@minutes: 3

# Dormant users

:::cols 1fr 1fr
:::col Dormant after 30 days without
- SAML sign-in, web sign-in
- Creating a repository, pushing to an **internal** repository over HTTPS
- Issues, pull requests, comments, labels, releases, stars, wiki pushes
:::col Does not count
- Personal access tokens, SSH keys, GitHub Apps
- Git operations on **private** repositories
- Browsing without interacting
- Public activity outside the enterprise
:::

:::callout warn A developer who pushes over SSH every day can look dormant
Reports: *Enterprise → People → Dormant users* and *Compliance → Reports*. Warn, wait a grace period, then remove. Exclude service accounts.
:::

---

@id: lab08
@layout: lab
@minutes: 20
@lab: 8

# Lab 8 · Audit log exploration

:::labtile
8 | 20 minutes | labs/lab08.md
:::

:::cols 1fr 1fr
:::col You will
- Filter the organization audit log with `action:`, `actor:` and `created:`
- Query it with `gh api`, including Git events and cursor pagination
- Read a `repo.create` payload field by field
- Write the daily export command that stands in for streaming
:::col Done when
- The verification command prints "Audit log API access confirmed"
- You can name the retention window for web and Git events
- You have chosen a streaming target for your own SIEM
:::

:::callout note Enterprise owners
Collapsible sections in the lab cover the enterprise audit log and the streaming setup screen.
:::

---

@id: day1-quiz
@layout: quiz
@minutes: 6

# Knowledge check

:::cols 1fr 1fr
:::col
:::quiz
Q: An enterprise policy enforces "private and internal only". An organization owner creates a public repository. What happens?
- A) The owner can override the enterprise policy
- B) They are blocked; enforced policies cannot be overridden
- C) The repository is created as internal instead
- D) A warning appears, then it proceeds
Answer: B — Enforced enterprise policies cannot be weakened one level down.
:::
:::col
:::quiz
Q: Your SRE group reviews pull requests in twelve organizations and gets Copilot Business from the enterprise. Membership lives in Entra ID. What do you set up?
- A) Twelve organization teams kept in sync by a script
- B) One enterprise team synced from the Entra ID group, assigned to all twelve
- C) Make every SRE an enterprise owner
- D) A nested team under each organization's engineering team
Answer: B — Enterprise teams are defined once, SCIM-synced under EMU, and carry review requests and Copilot licenses across organizations.
:::
:::

---

@id: day1-wrap
@layout: default
@minutes: 4

# Day 1 in four sentences

:::big
1. **Policies cascade down** and nobody can weaken them from below.
2. **Visibility plus base permission** decides who sees a repository; roles decide what they do.
3. **Defaults are on now**: models since 2026-08-26, Copilot features since 2026-10-22.
4. **Teams carry access**, and the identity provider should carry the teams.
:::

:::callout note Tomorrow
Repositories, rulesets, security scanning, the API, Actions. Six labs. Same time, same link.
:::
