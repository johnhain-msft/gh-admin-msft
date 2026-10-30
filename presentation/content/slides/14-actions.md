---
section: Actions, automation and Marketplace
day: 2
---

@id: sec-actions
@layout: section
@minutes: 1

# Actions, automation and Marketplace

:::chips
- Runners: hosted, self-hosted, ARC
- Policies and supply-chain controls
- Sharing workflows and actions
- gh CLI patterns for administrators
- Marketplace
:::

{{GH-100 · Manage GitHub Actions · Secure SDLC and compliance}}

---

@id: runners
@layout: default
@minutes: 2

# Runners

:::cards 3
:::card GitHub-hosted
- 50,000 minutes a month included; prices cut up to 39% on 2026-01-01
- New this year: `ubuntu-slim`, arm64 in private repositories, custom images, RHEL 9 and 10 (preview)
- Since 2026-06-25: macOS runner groups; standard labels can be disabled
:::card [warn] Self-hosted
- Register with 2.329.0 or later; install each release within 30 days. Enforced on GHEC since 2026-09-29
- Node 20 removed 2026-09-23
- $0.002 a minute platform charge: announced, then postponed
:::card [purple] Actions Runner Controller
- Runner scale sets on Kubernetes and OpenShift
- Supported by GitHub within scope: Helm installs, not your cluster
- Release 0.15.0 on 2026-10-01
:::

:::timeline
2026-10-19 | `ubuntu-latest` moves to Ubuntu 26.04 until 2026-11-19; pin `ubuntu-24.04` to defer | watch
2026-11-02 | macOS 14 image retired | soon
:::

---

@id: actions-policies
@layout: default
@minutes: 3

# Actions policies and supply-chain controls

:::cols 1fr 1.35fr
:::col General · check these everywhere
- **Allowed actions** · verified creators, block with `!`, full-SHA pinning (2025-08-15)
- **Check, workflow run, status, artifact and log retention** · 90 days default; covers checks and statuses since 2026-10-01
- **Fork pull request workflows** · approval before the first run
- **`GITHUB_TOKEN`** · read-only default for enterprises created on or after 2023-02-02
:::col Policies · what arrived in 2026
:::timeline
2026-04-10 | 50 reruns per workflow | done
2026-06-18 | `actions/checkout` v7 refuses pwn requests | done
2026-06-26 | Read-only cache for untrusted triggers; `cache-mode` 09-10 | done
2026-07-15 | Immutable OIDC `sub` for new, renamed, transferred repos | done
2026-07-28 | Malicious runs held for approval (public repos) | done
2026-09-17 | Execution protections GA · Evaluate · Policy insights | done
2026-11-02 | `pull_request_target` blocked by default, public repos | soon
:::
:::

---

@id: sharing-workflows
@layout: default
@minutes: 1

# Sharing workflows and actions

:::cols 1fr 1fr
:::col Inside the enterprise
- **Workflow templates** in the organization's `.github` repository; internal or private since 2025-09-18
- **Reusable workflows** with `workflow_call`; YAML anchors supported
- **Private actions**: *Settings → Actions → General → Access*, shared with the organization or the enterprise
:::col Outside, and what is new
- Repositories outside the enterprise: `actions/create-github-app-token`
- **Agentic Workflows** · Markdown compiled to Actions YAML, under your runner groups and policies · public preview since 2026-06-11
:::

---

@id: gh-cli-automation
@layout: default
@minutes: 2

# Scripting administration with gh

:::cols 1.15fr 1fr
:::col Three flags do most of the work
```bash
gh api /orgs/YOUR-ORG/members --paginate --jq '.[].login'

gh api graphql -f org=YOUR-ORG -f query='
  query($org: String!) { organization(login: $org) {
    teams(first: 10) { nodes { name members { totalCount } } } } }'
```
Preinstalled and authenticated on GitHub-hosted runners through `GITHUB_TOKEN`.
:::col Four patterns to script first
1. **Access audit** · repositories and the teams on them
2. **Bulk team management**
3. **Audit log export** to your SIEM
4. **Dormant user report**
:::

:::callout note Commit statuses vs check runs
Statuses: `POST /statuses/{sha}`, one state per context, any token. Check runs: GitHub Apps only, annotations and summaries. Rulesets require either by its **context name**.
:::

---

@id: marketplace
@layout: default
@minutes: 1

# Marketplace

:::cards 3
:::card Apps
GitHub Apps and OAuth Apps. Free, flat-rate or per-unit. Paid listings need a **verified publisher**. Organization owners decide who may install, and can require approval.
:::card Actions
Free to list. The allowed-actions policy limits workflows to **verified creators**, or to the patterns you name.
:::card [purple] Agent apps, MCP, retirements
**Agent apps** category since 2026-06-02. GitHub App Copilot Extensions stopped 2025-11-10; **MCP servers** and the GitHub MCP Registry (2025-09-16) replace them. GitHub Models retired 2026-07-30.
:::

---

@id: lab13
@layout: lab
@minutes: 15
@lab: 13

# Lab 13 · Scripts and gh CLI automation

:::labtile
13 | 15 minutes | labs/lab13.md
:::

:::cols 1fr 1fr
:::col You will · sections 13.1 to 13.3
- Check `gh auth status`; list repositories, members and organization settings with `gh api`
- Create `YOUR-HANDLE-lab13-team`, add a member, grant Write on a repository
- Query the audit log for `team.create` and `repo.create`
:::col Done when
- The team's members endpoint lists you
- The audit log shows your `team.create` event
- The team is deleted again in 13.7
:::

:::callout tip If time allows
13.4 the access-report script · 13.5 the same data in one GraphQL request · 13.6 a commit status that a ruleset could require
:::
