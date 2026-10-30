---
section: Rulesets
day: 2
---

@id: sec-rulesets
@layout: section
@minutes: 1

# Rulesets

:::chips
- Rulesets vs branch protection
- Anatomy: targets, rules, bypass, enforcement
- Organization vs repository
- What changed in 2026
:::

{{GH-100 · Secure SDLC and compliance}}

---

@id: rulesets-vs-bp
@layout: default
@minutes: 3

# Rulesets replace branch protection

| | Branch protection rules | Rulesets |
|---|---|---|
| Scope | One repository | Repository, organization or enterprise |
| Enforcement | On or off | **Active**, **Evaluate**, **Disabled** |
| Targets | Branches | Branches, tags, pushes |
| Layering | One rule per pattern | Many rulesets; the strictest combination wins |
| Bypass | Admins override | Named actors, *Always* or *Pull requests only*, logged |
| Visibility | Admins | Every contributor sees active rules |
| Audit and portability | Limited | Rule insights, JSON export and import |

:::callout dated Convert, do not recreate
Since **2026-08-11**, *Settings → Branches → Convert to ruleset* migrates a classic rule in place. Start it in Evaluate; delete the old rule when the page says rulesets cover it.
:::

---

@id: ruleset-anatomy
@layout: default
@minutes: 4

# Anatomy of a ruleset

:::diagram ruleset-anatomy

---

@id: org-vs-repo-rulesets
@layout: default
@minutes: 3

# Organization and repository rulesets

:::cols 1fr 1fr
:::col Layering
- An organization ruleset applies to every targeted repository, including new ones
- A repository ruleset adds; it never relaxes an organization rule
- Classic branch protection still counts: the strictest combination of all three applies
- Enterprise rulesets target organizations by **organization custom properties** (GA 2026-01-13)
:::col Target by property, roll out in Evaluate
- Repository targets: all, by name pattern, or by **custom property** such as `environment` or `compliance-level`
- Built-in **`deployable:true`** and **`deployed:true`** from storage and deployment records (2026-04-14)
- External properties from a CMDB or developer portal, read-only in GitHub (preview since 2026-09-29)
- **Evaluate** first, read **Rule insights**, then Active
:::

:::callout tip One to two weeks in Evaluate, then Active
The organization Rule insights dashboard (GA 2026-08-25) charts evaluations and top bypassers across every repository, and exports CSV.
:::

---

@id: rulesets-2026
@layout: default
@minutes: 4

# Rulesets in 2026

:::timeline
2026-02-17 | **Required reviewers** by team and file path, alongside CODEOWNERS | done
2026-05-07 | Individual **users as bypass actors** on repository rulesets; admins may rename rule-protected branches | done
2026-06-04 | **Enterprise teams** in bypass lists, defined once for every organization | done
2026-06-30 | **Restrict code coverage** merge gate; needs GitHub Code Quality; REST API since 2026-09-18 | preview
2026-07-07 | **Restrict who can dismiss reviews** inside the pull request rule | done
2026-08-11 | **Convert to ruleset** for classic branch protection | done
2026-08-25 | **Rule insights dashboards** GA; push-rule **path exceptions** in preview | done
2026-09-09 | **Require secret scanning alerts are resolved** before merging | preview
2026-09-29 | **External custom properties** from a CMDB as ruleset targets | preview
:::

:::aside
Stacked pull requests (preview since 2026-07-30) are checked as if every pull request targeted the base. The async merge API (GA 2026-10-01) is the only API that merges a stack.
:::

---

@id: lab03
@layout: lab
@minutes: 15
@lab: 3

# Lab 3 · Repository rulesets

:::labtile
3 | 15 minutes | labs/lab03.md
:::

:::cols 1fr 1fr
:::col You will
- Create the branch ruleset `default-branch-protection`, enforcement **Active**
- Bypass: *Repository admin*, mode **For pull requests only**
- Target the default branch; require a pull request with 1 approval, code owner review, conversation resolution
- Require the `build` status check, up to date; keep *Restrict deletions* and *Block force pushes*
:::col Done when
- The ruleset is listed as Active
- Editing a file on `main` forces a branch and a pull request
- The merge box shows review required and `build` required
:::

:::callout tip No `build` check yet?
Section 3.4 has a ten-line workflow. Commit it to `main`, wait for one run, and the check appears in the picker.
:::

---

@id: lab06
@layout: lab
@minutes: 15
@lab: 6

# Lab 6 · Advanced rulesets

:::labtile
6 | 15 minutes | labs/lab06.md
:::

:::cols 1fr 1fr
:::col You will · sections 6.1 to 6.3
- Organization branch ruleset `YOUR-HANDLE-org-branch-standards`: all repositories, all branches, signed commits, linear history, enforcement **Evaluate**
- Tag ruleset `YOUR-HANDLE-release-tag-protection`: `v*`, restrict creations, updates and deletions; bypass **Maintain**
- Push to `main` under Evaluate, switch to Active, push again
:::col Done when
- Both rulesets show **Active** in the organization list
- Rule insights shows the Evaluate entry and the Active block
- Only Maintain can create a `v*` tag
:::

:::callout note If time permits
6.4 exports the ruleset JSON and imports a recipe from `github/ruleset-recipes`. 6.5 compares rulesets with classic branch protection.
:::

---

@id: break2
@layout: break
@minutes: 10

# Break

Ten minutes. Back at the time on the agenda.

{{Press [[A]] for the agenda · [[B]] blanks the screen}}
