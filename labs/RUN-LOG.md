# Lab run log

A dry run of every lab, executed on 2026-10-29 with `gh` 2.103.3 and `git` 2.56 against this repository (`johnhain-msft/gh-admin-msft`, a **private repository on a personal GitHub Free account**) plus **read-only** checks of the organization-level commands against an organization the runner owns. Nothing was created or changed in any organization or enterprise; only this repository was written to.

Use this log two ways: to know, before a workshop, which steps need a paid plan or an organization, and as the record of which commands were verified against the live API.

## Summary

| Lab | Scope | Result | What a learner needs |
|---|---|---|---|
| Setup | tools | ✅ `gh --version`, `gh auth status`, `git --version` | scopes `admin:org`, `repo`, `workflow` seen |
| 1 · Webhooks | repository | ✅ webhook to a smee.io channel; `ping` delivered with HTTP 200 | repository admin |
| 2 · Actions settings | repository | ✅ allowed actions restricted to GitHub-created plus one allow-listed action; `GITHUB_TOKEN` default set to read | repository admin |
| 3 · Repository rulesets | repository | ⚠️ API answers `Upgrade to GitHub Pro or make this repository public` on a Free private repository | Pro, Team or Enterprise plan, or an organization repository |
| 4 · Templates | repository | ✅ issue form, issue config and pull request template committed; `is_template` set | repository admin |
| 5 · REST and GraphQL in Actions | repository | ✅ workflow ran on `push` and on `workflow_dispatch`; issues labeled `training` created and queried | Actions enabled |
| 6 · Advanced rulesets | organization | 🔎 `GET /orgs/{org}/rulesets` works (read-only); writes not attempted | organization owner |
| 7 · Security scanning | repository | ✅ Dependabot alerts and security updates enabled (a Dependabot PR appeared within minutes) · ⚠️ secret scanning and code scanning are not available on a Free private repository | GitHub Secret Protection and Code Security on the organization |
| 8 · Audit log | organization | ✅ read-only queries work **with `--method GET`**; see the finding below | organization owner |
| 9 · Teams and custom roles | organization | 🔎 `GET /orgs/{org}/teams` works; writes not attempted | organization owner |
| 10 · Dormant users | organization | ✅ members list, role filter, public-events probe and 30-day audit actors query (counts only) | organization owner |
| 11 · Apps and Marketplace | organization | 🔎 `GET /orgs/{org}/installations` works; installing not attempted | organization owner |
| 12 · Environments | repository | ⚠️ environments `staging` and `production` created; required reviewers and wait timer rejected: `ensure the billing plan supports the … protection rule` | paid plan for protection rules on private repositories, or a public repository |
| 13 · gh CLI automation | organization | ✅ organization metadata, members with `--paginate`, teams, security managers, rate limit and a GraphQL query | organization owner |
| 14 · Repository health | local | ✅ size via API, largest objects with `git rev-list` + `git cat-file`, branch list, `delete_branch_on_merge` set | clone of any repository |
| 15 · Copilot governance | organization | ✅ `GET /orgs/{org}/copilot/billing` and `/copilot/billing/seats` (read-only) | organization owner, Copilot Business or Enterprise |
| 16 · Enterprise teams | organization | ✅ `GET /orgs/{org}/teams?team_type=enterprise` works (returned none for this organization) | enterprise owner for creation |
| 17 · Managed settings | local | ✅ the three draft JSON files validate with `python -m json.tool` (organization-admin path) | enterprise owner for enforcement |
| 18 · Workflow execution protections | repository | ⚠️ repository-level `POST /repos/{owner}/{repo}/actions/policies` answers `Upgrade to GitHub Pro…` on a Free private repository; `GET /orgs/{org}/actions/policies` works read-only | Pro, Team or Enterprise plan, or an organization |

✅ ran and verified · 🔎 read-only verification of the command shape · ⚠️ blocked by the plan of the personal repository, documented in the lab

## Findings that changed the labs

1. **`gh api` sends POST when fields are present.** Every audit-log command written as `gh api /orgs/YOUR-ORG/audit-log -F phrase=… -F per_page=…` answered `404 Not Found`, while the same request with `--method GET` returned events. `--paginate` alone does not change the method. Labs 8, 10 and 13 now carry `--method GET` on every audit-log call that passes fields, and Lab 8's troubleshooting note says so. (Lab 16 passes the phrase as a query string, which already sends GET.) (Verified three ways: `-F`, `-f` and a query string; only `--method GET` or the query-string form works.)
2. **Rulesets, repository Actions policies and environment protection rules need a paid plan on private repositories.** On an organization repository in GitHub Enterprise Cloud none of this applies, which is why the labs assume the workshop organization. Labs 3, 6, 12, 17 and 18 now say what the 403 means for anyone practising on a personal Free account.
3. **Secret scanning and code scanning are organization features on private repositories.** Lab 7 already states the licensing prerequisite; the personal-account run confirms the exact API responses.

## Raw results

Every command below was run from inside a clone of this repository. Organization names and counts are reported; member names and payloads are not.

```text
## Setup — 2026-10-30T01:01Z
gh: gh version 2.103.3 (2026-10-26)
git: git version 2.56.0.windows.3
auth: Logged in to github.com account johnhain-msft (keyring)

## Lab 2 — Actions settings (API form of Settings > Actions > General)
allowed_actions=selected: OK   selected-actions github_owned_allowed=true + one pattern: OK
default GITHUB_TOKEN permissions=read: OK
verify: enabled=true allowed=selected / default=read

## Lab 1 — Webhook to a smee.io channel
hook created, deliveries: ping status=200

## Lab 5 — workflow "05-1. Use GitHub APIs"
workflow_dispatch: OK · runs: workflow_dispatch completed/success, push completed/success
issues labeled training: 2

## Lab 12 — environments
production with required reviewers: "Failed to create the environment protection rule. Please ensure the billing plan supports the required reviewers protection rule."
production with wait timer only: same message for the wait timer rule
staging (no rules): created · environments now: production, staging

## Lab 18 — repository-level Actions policy, evaluate mode
POST repos/{owner}/{repo}/actions/policies: "Upgrade to GitHub Pro or make this repository public to enable this feature."

## Lab 7 — security features on a Free personal private repository
Dependabot alerts: OK · Dependabot security updates: OK
secret scanning: "Secret scanning is not available for this repository."
code scanning default setup: "Code scanning is not enabled for this repository."

## Lab 3 — repository ruleset on a Free personal private repository
POST repos/{owner}/{repo}/rulesets: "Upgrade to GitHub Pro or make this repository public to enable this feature."

## Read-only organization checks (counts only)
Lab 13 · org metadata: OK (plan=enterprise, 52 repositories)
Lab 13 · members (--paginate): OK (21)      Lab 13 · teams: OK (11)
Lab 13 · rate limit: OK (4917/5000)          Lab 13 · GraphQL viewer: OK
Lab 10 · admins: OK (13)                     Lab 10 · distinct audit actors, 30 days: 5
Lab 11 · installed apps: OK (15)
Lab 15 · copilot billing: OK (seat_management=assign_selected, 11 seats)
Lab 16 · enterprise teams assigned to the organization: 0
Lab 6 · organization rulesets: 2             Lab 18 · organization Actions policies: 0
Lab 13 · security managers: 1

## Lab 8 — audit log (the method finding)
-F phrase='action:repo.create' (no method):        404 Not Found
-f phrase='action:repo.create' (no method):        404 Not Found
--paginate without a method:                       404 Not Found
"orgs/ORG/audit-log?phrase=action:repo.create":    2 events
--method GET -F phrase='action:repo.create':       2 events
verification command with --method GET:            "Audit log API access confirmed"

## Lab 14 — repository health on a scratch clone
size via API: 0 KB (new repository) · largest blob: package-lock.json 133 KB
branches: main, dependabot/npm_and_yarn/fast-uri-3.1.9 · delete_branch_on_merge: true

## Lab 17 — organization-admin path
OK copilot/managed-settings.json · OK copilot/team-mappings.json · OK copilot/teams/pioneers.json

## Lab 4 — template repository
is_template: true · .github/ISSUE_TEMPLATE/content-defect.yml, config.yml, .github/pull_request_template.md
```
