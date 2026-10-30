---
section: Organization administration
day: 1
---

@id: teams-why
@layout: default
@minutes: 2

# Why teams

:::cards 4
:::card Collaboration
Team @-mentions notify the right group. Project-focused or subject-focused; job titles or roles.
:::card Innersource
Discover, customize and reuse internal code, docs and CI. Lower cost, more flexibility, no vendor lock-in.
:::card Onboarding and offboarding
Put the person on the right team; the team stays on the right repositories. Leaving a team revokes access everywhere.
:::card Security
Grant Read, Write and Admin to groups, not individuals. Teams in CODEOWNERS automate review.
:::

:::callout note Three kinds that work
**Organizational units** mirror the company. **Product teams** keep notifications, CODEOWNERS and reviews with the maintainers. **Interest teams** share a topic. Plus one **all-employees** team for announcements.
:::

---

@id: nested-teams
@layout: default
@minutes: 3

# Nested teams: what flows down

:::diagram nested-teams
:::

---

@id: team-sync
@layout: default
@minutes: 3

# Team membership from your identity provider

:::cards 3
:::card Team sync · personal-account enterprises
- Microsoft Entra ID (commercial tenants) and Okta
- Up to five IdP groups per team; groups over 5,000 members unsupported
- A **parent** team cannot be synced
- Organization teams only; managed for the enterprise when SAML is enforced there
:::card [purple] SCIM groups · EMU
- IdP groups map to organization teams **and** enterprise teams
- Group changes add or remove organization access and Copilot licenses
- Team sync is not used with EMU
:::card [muted] Manual membership
- Web UI or the API
- Fine for small organizations; a liability at scale
- Manual edits to a synced team are overwritten at the next sync
:::

:::callout tip Naming
Prefix synced groups in the IdP, for example `GH-engineering-frontend`, and keep the parent-child structure in GitHub.
:::

---

@id: org-walkthrough
@layout: default
@minutes: 4

# Organization settings walkthrough

:::callout demo Share your screen on your organization settings
Start with your concerns; then every tab, with what is new in each.
:::

:::cards 4
:::card Access and security
- **Member privileges**: base permissions, repository creation, forking; block repository admins from installing apps; app access requests
- **Authentication security**: 2FA requirement, SSO, team sync
- **Advanced Security**: configurations, global settings; enterprise can **enforce** since 2026-09-15
- **Verified and approved domains**
:::card Audit, integrations
- **Audit log**: view, search, export; streaming is set at the enterprise
- **Webhooks** for the whole organization
- **Third-party Access**: OAuth app policy, GitHub Apps, PAT policy
- **Installed GitHub Apps**: review permissions
:::card Repository defaults, rules
- **Repository**: defaults for new repositories, commit comments off (2026-04-23), deleted repositories (90 days)
- **Rulesets** and **Rule insights**; immutable releases
- **Planning**: issue types and fields (GA 2026-07-02); Projects classic is gone
:::card Actions, Copilot, moderation
- **Actions**: General, Policies, Runners, Runner groups
- **Secrets and variables**: Actions, Dependabot, Codespaces
- **Copilot**: policies, cloud-agent firewall and runner, review runner
- **Moderation**: interaction limits incl. PR limits (2026-08-06), blocked users
:::

---

@id: insights
@layout: default
@minutes: 2

# Insights and usage metrics

:::kv
Copilot usage | Dashboards and API, GA 2026-02-27 at enterprise and organization level. The legacy metrics APIs shut down 2026-04-02.
Rule insights | Dashboards for repositories and organizations, GA 2026-08-25: successes, failures, bypasses, top bypassers.
Code Quality | Organization dashboards for maintainability and reliability across repositories.
Security overview | Alerts, coverage, campaigns and trends across an organization or the enterprise.
API insights | Who hits the REST rate limits, by actor and app.
Audit log | Includes agent activity: `actor_is_agent`, `agent_session.task`.
Dependency insights | Still exist, in maintenance mode. GitHub points to the SBOM toolkit instead. Activity Overview was retired in January 2024.
:::

:::aside
Pull it into Grafana or your SIEM through the APIs. Understand the outliers before you react to a KPI.
:::

---

@id: security-quality
@layout: default
@minutes: 1

# Security & quality, the organization view

:::cols 1fr 1fr
:::col One tab since 2026-04-02
- Alerts for every repository the organization owns, filtered and sorted in one place
- Code Quality findings on the same tab
- Repository sidebars: *Vulnerability alerts* is now **Findings**, *Policy* is **Security policy**
- The enterprise has a security overview too
:::col Operating it
- Security campaigns and alert assignees, GA 2025-11-25
- Delegated bypass reviewers for push protection can be set at the enterprise
- Dependabot alerts closed for two years or more move to archive from 2026-09-25; CSV download stays
:::

---

@id: lab09
@layout: lab
@minutes: 20
@lab: 9

# Lab 9 · User and team administration

:::labtile
9 | 20 minutes | labs/lab09.md
:::

:::cols 1fr 1fr
:::col You will
- Create `YOUR-HANDLE-engineering` with two child teams
- Grant Read to the parent and Write to a child on a repository, and watch the higher role win
- Create two custom repository roles: contractor and security-reviewer
- Walk through team sync, and where SCIM replaces it
:::col Done when
- The parent lists both children on its Teams tab
- A child-team member has Write without a direct grant
- Both custom roles appear in the access dropdown
:::

:::callout tip Only one account?
Verify inheritance on the Collaborators and teams page instead of signing in twice. The incognito path adds three to five minutes.
:::
