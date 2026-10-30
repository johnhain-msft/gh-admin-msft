# GitHub Enterprise Cloud Administration · workshop kit

**Level 300 · two days · three hours a day · remote, hands-on.**
For enterprise owners, organization owners and repository administrators who already use GitHub every day and now have to govern it.

This repository is the complete delivery kit: the teaching deck, the read-aloud presenter script, eighteen hands-on labs, thirty reference documents, the instructor materials, and the test suite that keeps all of it current. Everything here is generic: no customer names, no customer data, no PowerPoint.

| I want to… | Open |
|---|---|
| **Present** the workshop | [`presentation/dist/index.html`](presentation/dist/index.html) (one file, works from disk) and [`presenter/PRESENTER-SCRIPT.md`](presenter/PRESENTER-SCRIPT.md) |
| **Run the labs** as a participant | [`labs/setup.md`](labs/setup.md), then the lab tables below |
| **Prepare** to deliver it | [Instructor Guide](docs/INSTRUCTOR-GUIDE.md) · [Agenda](docs/AGENDA.md) · [Pre-workshop checklist](docs/PRE-WORKSHOP-CHECKLIST.md) |
| **Look something up** | the [reference docs](#reference-documentation) and the [Reference card](docs/REFERENCE-CARD.md) |
| **Change the material** | [Maintaining the kit](#maintaining-the-kit) |

## The deck

`presentation/dist/index.html` is a self-contained teaching web app. Open it in any current browser, from disk or from a static host.

- **Two surfaces, one file.** The audience sees sparse slides. Press **S** to open the **speaker window**: current and next slide, the full script for the slide, a running clock against the planned minutes, and prev/next controls that drive the deck. Open it before you press **F**, because opening a window leaves fullscreen. Nothing from the script is ever rendered on the audience screen.
- **Teaching interactions.** Staged reveals (press Next to build a diagram), a base-permission × visibility grid you can switch live, an authentication decision tree the room can answer, hover-to-trace diagrams, and knowledge-check quizzes with click-to-reveal answers.
- **Navigation.** **A** opens the timed agenda in any time zone, **G** the overview grid (the same key closes each overlay again, since **Esc** would also leave fullscreen), **F** presents fullscreen, **B** blanks the screen, **T** switches light and dark, **P** prints every slide to a PDF handout, **?** lists every shortcut. Every slide has a stable URL (`#/slide-id`).
- **Two days, 180 planned minutes each,** in the order of [`docs/AGENDA.md`](docs/AGENDA.md).

The deck is built from Markdown. Slides live in `presentation/content/slides/`, the script in `presentation/content/script/`, diagrams in `presentation/content/diagrams/`, the timed agenda in `presentation/content/agenda.json`. `node presentation/build.mjs` rebuilds both the deck and `presenter/PRESENTER-SCRIPT.md` from the same sources, so they cannot drift apart. See [`presentation/README.md`](presentation/README.md) for the authoring format.

## Agenda

| Day | Theme | Blocks |
|---|---|---|
| **1** | Enterprise, organization and governance | Enterprise overview · Permission flow · Enterprise administration and AI controls (Lab 15) · Organizations · Organization administration (Lab 9) · Audit log and dormant users (Lab 8) |
| **2** | Repository, security, API and advanced topics | Repository governance (Lab 4) · Rulesets (Labs 3 and 6) · Security in the cloud (Lab 7) · API and authentication (Lab 5) · Actions, automation and Marketplace (Lab 13) · Wrap-up |

Full timing, demos and the VBD topic coverage matrix: [`docs/AGENDA.md`](docs/AGENDA.md).

## Hands-on labs

Participants work in a workshop organization on GitHub Enterprise Cloud. Every lab names the objects it creates with `YOUR-HANDLE` so a shared organization does not collide, and labs that need enterprise-owner access have an organization-owner path.

### In-session

| Lab | Title | Agenda slot (min) | Needs |
|---|---|---|---|
| [Setup](labs/setup.md) | Environment check | 5 | `gh`, `git`, the organization name |
| [3](labs/lab03.md) | Repository rulesets | 15 | repository admin |
| [4](labs/lab04.md) | GitHub templates | 10 | repository admin |
| [5](labs/lab05.md) | GitHub API with REST and GraphQL | 15 | repository admin, Actions |
| [6](labs/lab06.md) | Advanced repository rulesets | 15 | organization owner |
| [7](labs/lab07.md) | Security scanning and push protection | 20 | Secret Protection and Code Security licensed |
| [8](labs/lab08.md) | Audit log exploration | 20 | organization owner |
| [9](labs/lab09.md) | User and team administration | 20 | organization owner |
| [13](labs/lab13.md) | Scripts and gh CLI automation | 15 | organization owner |
| [15](labs/lab15.md) | Copilot governance configuration | 15 | organization owner, Copilot Business or Enterprise |

Each lab states its own duration range; the in-session slot is the lower bound, and labs 6, 7 and 13 carry an instructor note on which sections fit the slot.

### Self-paced extensions

| Lab | Title | Minutes | Needs |
|---|---|---|---|
| [1](labs/lab01.md) | Webhooks and events | 5–10 | repository admin |
| [2](labs/lab02.md) | Actions settings | 5–10 | repository admin |
| [10](labs/lab10.md) | Dormant user management | 15–20 | organization owner |
| [11](labs/lab11.md) | GitHub Apps and Marketplace | 15–20 | organization owner |
| [12](labs/lab12.md) | Deployments and environments | 20–25 | repository admin (protection rules need a paid plan on private repositories) |
| [14](labs/lab14.md) | Unhealthy repositories and Git history | 20–25 | repository admin, `git-filter-repo` |
| [16](labs/lab16.md) | Enterprise teams | 20–30 | enterprise owner (organization-owner path included) |
| [17](labs/lab17.md) | Enterprise managed settings for Copilot | 20–30 | enterprise owner (organization-admin path included) |
| [18](labs/lab18.md) | Workflow execution protections | 20–30 | organization owner |

[`labs/RUN-LOG.md`](labs/RUN-LOG.md) records a full dry run of the labs against this repository and a read-only check of the organization-level commands, with what works on a personal account and what needs a paid plan or an organization.

## Reference documentation

| Area | Docs |
|---|---|
| Enterprise and organization | [01 Hierarchy](docs/01-enterprise-hierarchy.md) · [02 Organization strategies](docs/02-organization-strategies.md) · [06 Policy inheritance](docs/06-policy-inheritance.md) · [28 Enterprise teams](docs/28-enterprise-teams.md) · [29 Enterprise managed settings](docs/29-enterprise-managed-settings.md) |
| Identity and access | [03 IAM](docs/03-identity-access-management.md) · [04 Enterprise Managed Users](docs/04-enterprise-managed-users.md) · [05 Teams and permissions](docs/05-teams-permissions.md) · [21 User administration](docs/21-user-administration.md) · [26 Privacy and data residency](docs/26-user-privacy-data-residency.md) |
| Repositories and security | [07 Repository governance](docs/07-repository-governance.md) · [08 Security and compliance](docs/08-security-compliance.md) · [11 Security-by-default policies](docs/11-security-by-default-policies.md) · [17 Actions command injection](docs/17-github-actions-security-echo-command-injection.md) · [25 Unhealthy repositories](docs/25-unhealthy-repos-git-history.md) · [30 Workflow execution protections](docs/30-actions-workflow-execution-protections.md) |
| Copilot and AI | [12 Copilot governance](docs/12-github-copilot-governance.md) · [29 Enterprise managed settings](docs/29-enterprise-managed-settings.md) |
| Operations, API, billing | [19 Licenses and billing](docs/19-licenses-billing.md) · [20 Marketplace and apps](docs/20-github-marketplace-apps.md) · [22 Audit log deep dive](docs/22-audit-log-deep-dive.md) · [23 Deployment strategies](docs/23-deployment-strategies.md) · [24 Scripts and automation](docs/24-scripts-automation.md) · [27 Integrations and Status API](docs/27-integrations-status-api.md) |
| Architecture and migration | [09 Well-Architected](docs/09-best-practices-waf.md) · [10 Reference architecture](docs/10-reference-architecture.md) · [13 Onboarding plan](docs/13-github-onboarding-implementation-plan.md) · [14 GEI from Azure DevOps](docs/14-github-enterprise-importer-ado-guide.md) · [15 Azure Pipelines with GitHub](docs/15-azure-pipelines-github-repos-integration.md) · [16 ADO migration analysis](docs/16-azure-devops-to-github-migration-analysis.md) · [18 Renaming an organization](docs/18-github-rename-org-impact.md) · [ADO migration assessment](docs/ado-to-github-migration-assessment.md) · [ADO migration business case](docs/ADO-to-GitHub-Migration-Business-Case.md) |

Instructor materials: [Instructor Guide](docs/INSTRUCTOR-GUIDE.md) · [Knowledge checks](docs/KNOWLEDGE-CHECKS.md) · [Post-workshop assessment](docs/POST-WORKSHOP-ASSESSMENT.md) · [FAQ](docs/FAQ-workshop.md) · [Reference card](docs/REFERENCE-CARD.md).

## Maintaining the kit

```bash
npm install                      # once
node presentation/build.mjs      # rebuild the deck and the presenter script
node scripts/deck-qa.mjs         # screenshot every slide to presentation/qa/ and flag overflow
node scripts/deck-live-edge.mjs  # Windows and Edge: rehearse on the real screen (true fullscreen, speaker pop-up) and capture it
npm test -- --skip-links         # lint, structure, freshness, spelling, coverage, deck checks
npm run test:links               # slow: every external link
```

Content currency is enforced, not hoped for: `tests/validate-freshness.js` fails the build on claims the GitHub changelog has overtaken (the retired per-request Copilot billing unit, alert-only GHAS budgets, the old cost-center limit, and more), `tests/validate-deck.js` checks that every slide has a script and no script text leaks onto a slide, and the CI workflow runs all of it on every push. When GitHub changes something, change the Markdown, rebuild, and let the tests tell you what else moved.

## Lineage and license

The labs and reference documents descend from the GitHub ABCs admin training by GitHub Professional Services, used under the MIT License, and were extended and refreshed through October 2026. The deck, script, build tooling and tests are new. See [LICENSE](LICENSE).
