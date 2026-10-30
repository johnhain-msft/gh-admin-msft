---
section: Repository governance
day: 2
---

@id: day2-welcome
@layout: default
@minutes: 5

# Welcome back

:::big
1. **Policies cascade down**; nobody weakens them from below.
2. **Visibility × base permission** decides who sees a repository.
3. **Defaults are on**: models 2026-08-26, Copilot features 2026-10-22.
4. **Teams carry access**, and the identity provider should carry the teams.
:::

:::cols 1fr 1fr
:::col Today · down to the repository
- Repository governance and templates
- Rulesets at repository and organization scope
- Security products, push protection, the cost model
- API, authentication, Actions, Marketplace
:::col Six labs
- **Lab 4** templates · **Lab 3** and **Lab 6** rulesets
- **Lab 7** security scanning · **Lab 5** API
- **Lab 13** scripts and the `gh` CLI
:::

---

@id: sec-repos
@layout: section
@minutes: 1

# Repository governance

:::chips
- Landing page
- Settings walkthrough
- Templates as governance
- CODEOWNERS and custom properties
:::

{{GH-100 · Administer the environment · Secure SDLC and compliance}}

---

@id: repo-landing
@layout: default
@minutes: 4

# The repository landing page

:::cols 1fr 1fr
:::col What the page tells you
- Tabs follow **permission**: Settings shows for Maintain and Admin; every setting needs Admin
- A feature switched off in Settings loses its tab: Issues, Wiki, Projects, Discussions
- README renders on the page; [[T]] opens the file finder
- Right rail: about, releases, packages, contributors
:::col Renamed and added
:::timeline
2026-01-26 | **Agents** tab joins the navigation | done
2026-04-02 | **Security** became **Security & quality**; *Vulnerability alerts* became *Findings* | done
2026-09-21 | Refreshed pull requests page: bulk actions, review-status filters | done
:::
:::

:::aside
URLs and APIs did not change with the renames. Old bookmarks and scripts work; old screenshots do not.
:::

---

@id: repo-settings
@layout: default
@minutes: 6

# Repository settings walkthrough

:::callout demo Share your screen on a repository you administer
Start where you have questions, then every sidebar group in order. Nothing is changed during the walkthrough.
:::

:::cards 4
:::card General
- Features: issues **collaborators only** (2026-06-29), pull request access and open-PR limits (2026-02-13, 2026-06-17), commit comments
- Template repository, merge methods, auto-delete head branches
- Danger zone: deleting a private repository deletes its forks; restore within 90 days
:::card Access · Code, planning, and automation
- Collaborators and teams: prefer teams
- **Branches** holds classic rules and *Convert to ruleset* (2026-08-11); **Rulesets** is where new rules go
- Actions, Environments, Pages, Custom properties
:::card Security & quality
- **Advanced Security**: Secret Protection, push protection and its exemptions (2026-03-23), code scanning, Dependabot rules, private vulnerability reporting
- Deploy keys: read-only by default; write is one checkbox
- Secrets and variables: environment secrets first
:::card Integrations · Copilot
- GitHub Apps are installed at the organization; webhooks when an app is too much
- Autolink references; email notifications on push
- Copilot: cloud agent firewall and runner, code review; Code quality
- Admins can archive pull requests (2026-07-16)
:::

---

@id: templates-governance
@layout: default
@minutes: 4

# Templates are governance

:::cards 4
:::card Issue forms and templates
`.github/ISSUE_TEMPLATE/*.yml`: required fields, labels, assignees. Organization defaults live in the `.github` repository.
:::card Pull request template
`.github/pull_request_template.md`: the checklist every change answers before anyone reviews it.
:::card Template repositories
*Template repository* in General. New repositories inherit `.github`, workflows, CODEOWNERS and `SECURITY.md` on day one.
:::card [purple] CODEOWNERS and custom properties
`CODEOWNERS`: last matching line wins; pair it with *Require review from Code Owners*. Custom properties classify repositories so rulesets and configurations find them.
:::

:::callout tip Standardize once, at the organization
Community health files in the `.github` repository, one template per stack, required custom properties with defaults. Lab 4 builds the first two.
:::

---

@id: lab04
@layout: lab
@minutes: 10
@lab: 4

# Lab 4 · GitHub templates

:::labtile
4 | 10 minutes | labs/lab04.md
:::

:::cols 1fr 1fr
:::col You will
- Add an issue template from *Settings → General → Features → Set up templates*
- Commit `.github/pull_request_template.md` to `main`
- Optional: mark the repository as a template and create one from it
:::col Done when
- A new issue offers your template
- The pull request template file exists
- A new pull request opens with the template in its description
:::

:::callout note Leave *Creation allowed by* alone
The same Features section can restrict issue creation to collaborators (2026-06-29; triage included since 2026-08-03). Read it, do not change it today.
:::
