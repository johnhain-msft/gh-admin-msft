# Script · Organization administration

## [teams-why] Why teams

Four reasons to run everything through teams.

Collaboration. Teams are central to GitHub's collaboration features, like team at-mentions, which notify the right group that you want their input. A team can be project-focused or subject-focused, and it can map to job titles or roles.

Innersource. Helping your teams discover, customize and reuse internal projects: code, documentation, shared CI. That lowers cost, adds flexibility, and ends vendor lock-in between your own departments.

Onboarding and offboarding. Instead of adding or removing a person on each repository, you put them on the right team. The team stays assigned to the right repositories. Leaving the team revokes access everywhere. Less work, and less risk.

Security. You grant Read, Write and Admin to groups, not individuals. And teams work in CODEOWNERS files to define and automate pull-request review.

Three kinds of team work well. Organizational units that mirror the company. Product teams, which keep notifications, CODEOWNERS and reviews close to the maintainers. Interest teams around a topic, technical or not. And one all-employees team for global announcements.

> Teams can nest. Here is exactly what flows down, and what does not.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/organizing-members-into-teams/about-teams

## [nested-teams] Nested teams: permissions and notifications flow down

CLICK: Reveal the parent team.

Say we have a parent team, engineering, with Read on every product repository.

CLICK: Reveal the three child teams.

The parent has child teams. The permissions the parent holds pass down to every child. Frontend gets Read on everything through the parent, and Write on blue slash web of its own. Notifications flow down too: mention engineering and every child-team member is notified. In a five-hundred-person organization, that is five hundred notifications, so mention the top team on purpose.

CLICK: Reveal the grandchildren.

A child can itself be a parent. Each child has exactly one parent; a parent can have many children.

CLICK: Reveal the red cross.

And nothing flows up. A child team's Write never reaches the parent. Members of a child appear on the parent's Members tab, but they are not direct members of it. Two things cannot be nested: secret teams, and enterprise teams.

The resolution rule for Lab 9: a person's access to a repository is the most permissive of their direct grant, every team that applies, and the organization base permission. A child team can never end up with less than its parent.

> Who maintains the membership? Ideally, not you.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/organizing-members-into-teams/about-teams
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-fundamentals/teams-in-an-enterprise

## [team-sync] Team membership from your identity provider

Three ways to fill a team, and which one you use depends on the kind of enterprise.

Team sync, for enterprises with personal accounts. You connect a GitHub team to an IdP group in Microsoft Entra ID, commercial tenants only, or Okta. Membership updates as the group changes. Up to five groups per team; groups over five thousand members are not supported. A parent team cannot be synced: if the team you want to connect is a parent, create a new team or remove the nested relationship. Team sync works with organization teams only, and when SAML is enforced at the enterprise it is managed for the whole enterprise.

SCIM groups, for managed-user enterprises. Team sync is not used with EMU at all. Instead, the IdP's SCIM groups map to organization teams and to enterprise teams, and a group change can add or remove organization access and Copilot licenses in one go.

And manual membership, through the web UI or the API. Fine for a small organization, a liability at scale, and any manual edit to a synced team is overwritten at the next sync.

Naming tip: prefix the synced groups in your IdP, GH dash engineering dash frontend, so people can see which groups drive GitHub access, and keep the parent-child structure in GitHub.

ASK: Who is on team sync, who is on SCIM, and who is still maintaining teams by hand? Quick chat poll.

> Now your organization settings, on your screen.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/managing-team-synchronization-for-your-organization
https://docs.github.com/en/enterprise-cloud@latest/organizations/organizing-members-into-teams/synchronizing-a-team-with-an-identity-provider-group
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-fundamentals/teams-in-an-enterprise

## [org-walkthrough] Organization settings walkthrough

DEMO: The customer shares their organization settings. Concerns first, then every tab in order.

Where do you want to start? Then I will walk the rest, and the slide groups the tabs with what changed in each.

DO: Open Member privileges, Authentication security, Advanced Security, Verified and approved domains.

Member privileges: base permissions, repository creation and forking, the same options as the enterprise, and locked where the enterprise enforces them. Two newer controls live here: blocking repository admins from installing GitHub Apps, GA December 2025, and app access requests, GA January this year. Authentication security is where you require two-factor and manage SSO and team sync. Advanced Security is managed through security configurations, the GitHub-recommended one or your own, and since September 15 the enterprise can enforce a configuration so organization owners cannot override it. Verified and approved domains are worth doing: a verified badge, visibility of member emails on your domain, and notification restriction to company addresses.

DO: Open Audit log, Webhooks, Third-party Access, Installed GitHub Apps.

The organization audit log is for viewing, searching and exporting; streaming is configured at the enterprise. Organization webhooks receive events for the whole organization; good for governance automation, though GitHub Apps are usually the better integration path. Third-party Access holds the OAuth app policy, GitHub Apps, and the personal-access-token policy with fine-grained approval and lifetimes; review approvals monthly. Installed GitHub Apps: review what each app can do.

DO: Open Repository, Rulesets, Planning.

Repository defaults apply to every new repository, which is good for first-time setup and not a governance tool. Commit comments can be turned off organization-wide since April 23. Deleted repositories can be restored for ninety days. Rulesets and Rule insights we do tomorrow. Issue types and issue fields went GA July 2, and Projects classic is gone.

DO: Open Actions, Secrets and variables, Copilot, Moderation.

Actions has General, the new Policies section for workflow execution protections, Runners and runner groups. Secrets and variables cover Actions, Dependabot and Codespaces, scoped to all, private or selected repositories. Copilot has the organization policies plus the cloud-agent firewall and runner controls from April 3 and the default runner for code review. Moderation has interaction limits, which since August 6 include pull-request limits for users without write access, and blocked users.

> With the settings seen, where do you look to know what is happening?

SOURCE: https://github.blog/changelog/2025-12-01-block-repository-admins-from-installing-github-apps-now-generally-available
https://github.blog/changelog/2026-01-12-controlling-who-can-request-apps-for-your-organization-is-now-generally-available
https://github.blog/changelog/2026-09-15-enforce-github-advanced-security-configurations
https://github.blog/changelog/2026-04-23-disable-commit-comments-across-your-organization
https://github.blog/changelog/2026-07-02-issue-fields-are-now-generally-available
https://github.blog/changelog/2026-04-03-organization-firewall-settings-for-copilot-cloud-agent
https://github.blog/changelog/2026-08-06-set-pull-request-limits-at-the-organization-level
https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization

## [insights] Insights and usage metrics

Activity Overview was retired in January 2024, so if an older deck told you to open organization Insights for activity, this is where that data lives now.

Copilot usage metrics: dashboards and an API, GA February 27 at enterprise and organization level. The legacy Copilot metrics APIs were shut down on April 2, so anything still calling them is broken. Rule insights dashboards, GA August 25: successes, failures, bypasses over time, and the most active bypassers. Code Quality has organization dashboards. Security overview shows alerts, coverage and campaigns. API insights show who is hitting the REST rate limits. And the audit log now includes agent activity, with actor is agent on every entry.

Dependency insights still exist, in maintenance mode; GitHub points you to the SBOM toolkit instead.

All of this is available through the API, so pull it into Grafana or your SIEM. And one caution: understand the reasons behind an outlier before you react to a KPI.

> One more tab before the lab: Security and quality.

SOURCE: https://github.blog/changelog/2023-12-19-upcoming-deprecation-of-organization-insights-activity-overview-beta/
https://github.blog/changelog/2026-02-27-copilot-metrics-is-now-generally-available
https://github.blog/changelog/2026-01-29-closing-down-notice-of-legacy-copilot-metrics-apis
https://github.blog/changelog/2026-08-25-rule-insights-dashboard-generally-available
https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/security-at-scale/security-overview

## [security-quality] Security & quality, the organization view

The Security tab became Security and quality on April 2, at repository, organization and enterprise level. URLs and APIs did not change, so old bookmarks still work. It shows alerts for every repository the organization owns, and Code Quality findings on the same tab. In repository sidebars, Vulnerability alerts is now Findings, and Policy is Security policy.

Operating it: security campaigns and alert assignees have been GA since November 2025. Delegated bypass reviewers for push protection can be set at the enterprise. And from September 25, Dependabot alerts closed for two years or more move to archival storage; admins can still download them as CSV.

Tomorrow's security block goes deep on all of this. For now, know where the tab is.

> Twenty minutes of hands-on: Lab 9.

SOURCE: https://github.blog/changelog/2026-04-02-the-security-tab-is-now-security-quality
https://github.blog/changelog/2025-11-25-secret-scanning-alert-assignees-security-campaigns-are-generally-available
https://github.blog/changelog/2026-06-30-cloud-data-retention-policy-for-closed-security-alerts

## [lab09] Lab 9 · User and team administration

LAB: Twenty minutes. Share the lab link in chat.

Lab 9, twenty minutes, labs slash lab09.

You will create a parent team prefixed with your handle and two child teams. You will grant Read to the parent and Write to a child on a repository, and watch the higher role win. You will create two custom repository roles, contractor and security-reviewer. And you will walk through team sync and where SCIM replaces it.

Done when the parent lists both children, a child-team member has Write without a direct grant, and both custom roles appear in the access dropdown.

If you only have one account, verify inheritance on the Collaborators and teams page rather than signing in twice; the incognito path costs three to five minutes you do not have.

DEMO: Create the parent team on screen, then let the room go.

TIME: Call two minutes before the end. Ask one person to show their effective-role column.

> Next: how you prove what happened. The audit log.
