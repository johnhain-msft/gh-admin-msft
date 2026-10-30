# Script · Rulesets

## [sec-rulesets] Rulesets

SHOW: Section slide with four chips.

This section is rulesets, and I spend more time here than anywhere else today. First the comparison with branch protection rules, because most of you still run both. Then the anatomy: targets, rules, bypass list, enforcement. Then organization versus repository rulesets and how they layer. Then everything that changed in 2026, which is a lot.

What I want you to take away: you can read a ruleset and predict what it blocks. You know why Evaluate comes before Active. And you can design the organization baseline: a few rulesets, targeted by property, with a bypass list you can defend to an auditor.

> Start with the question every team asks: why move at all.

## [rulesets-vs-bp] Rulesets replace branch protection

SHOW: The comparison table, then the dated callout.

Seven rows, and the first two decide it.

Scope. A branch protection rule lives in one repository. A ruleset lives in a repository, an organization or the enterprise, so one definition covers hundreds of repositories, including the ones created next week.

Enforcement. Branch protection is on or off. A ruleset is Active, Evaluate or Disabled. Evaluate is the dry run: the rules are checked on real traffic, nothing is blocked, and every result lands in Rule insights. That one mode is why migrations stop being scary.

Targets. Branches only, versus branches, tags and pushes. Tag rulesets protect your release markers. Push rules restrict file paths, extensions and sizes.

Layering. One rule per branch pattern, versus as many rulesets as you need on the same branch. When several apply, the strictest combination wins. Nothing relaxes anything.

Bypass. With branch protection, admins override and the trail is thin. With rulesets you name the actors, you pick Always or Pull requests only, and every bypass is logged.

Visibility. Branch protection is for admins. Active rulesets are visible to every contributor, so a blocked developer can read why.

Audit and portability. Rule insights, and JSON export and import, so a ruleset is a file in version control.

The two coexist. Both are evaluated on every push and every merge, and the strictest combination applies. The risk is not security; it is a developer who cannot tell which rule blocked them.

The dated callout is the migration path. Since August 11, Settings, Branches has a Convert to ruleset button next to each classic rule. GitHub maps required reviews, status checks and push restrictions into equivalent ruleset rules and shows the new behavior before you pick a status. Active is the default; pick Evaluate for a first migration. One rule does not map one to one: conversation resolution lives inside the pull request rule. When the page says rulesets fully cover the old rule, delete it. Use conversion for repository rules; for policy that spans repositories, build organization rulesets.

ASK: Show of hands in chat: who still has classic rules, who is on rulesets, who has both?

> Here is what is inside one.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/converting-branch-protections-to-rulesets
https://github.blog/changelog/2026-08-11-automatically-migrate-branch-protection-rules-to-repository-rulesets

## [ruleset-anatomy] Anatomy of a ruleset

SHOW: The anatomy diagram. Hovering a box highlights it.

DO: Walk the four boxes left to right.

Box one, targets. Which refs, and in an organization ruleset, which repositories. Branches by the default-branch shortcut, by pattern such as release slash star star, or all of them with tilde ALL. Tags by pattern, v star. Push rulesets target the pushes themselves: file paths, extensions, sizes. An organization ruleset adds the repository target: all, a name pattern, or a custom property such as environment equals production, or the built-in deployable true. Lab 3 uses the default-branch shortcut, so the ruleset follows a rename from master to main without an edit.

Box two, rules. What is enforced. Require a pull request, with a number of approvals, dismissed stale reviews, code owner review, and since February 17 required reviewers by team and path. Required status checks, and required workflows. Signed commits and linear history. Block force pushes, deletions, creations. Two newer ones in preview: require secret scanning alerts resolved, and code coverage thresholds, which needs Code Quality. GitHub Docs keeps the full list; I will not read it.

Box three, the bypass list. Named exceptions. Roles such as repository admin or maintain. Organization teams, and since June 4 enterprise teams, so one break-glass team covers every organization. GitHub Apps and deploy keys. And since May 7, individual users on repository rulesets, so one service account no longer needs a team of one.

Two modes you can set in the UI. Always: the actor can push directly and merge without satisfying the rules. For pull requests only: direct pushes are still blocked, but the actor can merge a pull request that does not meet every rule. That is what Lab 3 gives repository admins, and it is the mode I recommend for humans: still a pull request, still a trail. Every Always or pull-request-only bypass is logged in Rule insights.

The diagram also names a third value, exempt, which only the API accepts: the rules do not run for that actor, and nothing is logged. If an exported ruleset contains it, review it.

Box four, enforcement. Active blocks what the rules forbid. Evaluate runs the rules on real traffic and records results without blocking. Disabled keeps the definition and applies nothing. Rule insights is where Evaluate pays off, and its dashboards went GA on August 25.

The design pattern I want you to leave with, one sentence per box. Target by property, not by name. Keep the rules few and explainable. Keep the bypass list short and named, humans on pull requests only. Evaluate before Active, every time. A ruleset you cannot explain in those four sentences is a ruleset nobody will respect.

CHECK: Confirm the exempt bypass mode is still API-only, and that the secret scanning and coverage rules are still previews, before delivery.

> One ruleset is simple. The interesting question is what happens when three of them apply.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
https://github.blog/changelog/2026-02-17-required-reviewer-rule-is-now-generally-available
https://github.blog/changelog/2026-05-07-repository-rulesets-user-bypass-and-branch-renaming
https://github.blog/changelog/2026-06-04-enterprise-teams-is-now-generally-available
https://github.blog/changelog/2026-08-25-rule-insights-dashboard-generally-available
https://github.blog/changelog/2026-09-09-block-pull-requests-with-exposed-secrets-from-merging
https://github.blog/changelog/2026-06-30-github-code-coverage-merge-protection-for-pull-requests

## [org-vs-repo-rulesets] Organization and repository rulesets

Left column, layering. An organization ruleset is defined once by an organization owner and applies to every targeted repository, including the ones that do not exist yet. A repository ruleset, which a repository admin can create, adds to that. It can require three approvals where the organization requires two. It can never require one. Classic branch protection still counts as a third layer, and the strictest combination of all three applies. And the enterprise has its own layer: enterprise rulesets, which target organizations by organization custom properties, GA since January 13.

Right column, targeting. Name patterns such as production dash star work until a team names its production service something else. Custom properties fix that: environment, compliance level, internet-facing, defined by the organization, filled in on the repository, and the ruleset follows the value. Since April 14 there are two built-in ones: deployable true, the repository has an active storage record, and deployed true, it has an active deployment record. They come from your linked artifacts page, so they are only as accurate as what your pipelines upload. And since September 29, in preview, a CMDB or developer portal can own the properties through a GitHub App, read-only in GitHub, under the app's prefix.

One operational change from May 7: a repository admin can rename a branch that organization or enterprise rulesets cover, as long as every rule that applied to the old name applies to the new one. The organization setting is off for existing organizations and on for new ones; the enterprise policy decides who may rename. Master to main no longer needs an enterprise owner.

The tip is the rollout. Create the organization ruleset in Evaluate. Leave it for one to two weeks. Read the organization Rule insights dashboard, GA since August 25: evaluations, failures and top bypassers across every repository, with a CSV export. Fix the repositories that would have failed, or fix the rule. Then switch to Active, and tell people the date.

CHECK: External custom properties are a preview. Confirm the status before delivery.

> Now the year in one timeline.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/managing-rulesets-for-repositories-in-your-organization
https://github.blog/changelog/2026-01-13-organization-custom-properties-now-generally-available
https://github.blog/changelog/2026-04-14-deployment-context-in-repository-properties-and-alerts
https://github.blog/changelog/2026-09-29-bring-business-context-with-external-custom-properties
https://github.blog/changelog/2026-05-07-repository-rulesets-user-bypass-and-branch-renaming
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-organization-settings/allowing-repository-admins-to-rename-branches-with-organization-rulesets
https://github.blog/changelog/2026-08-25-rule-insights-dashboard-generally-available

## [rulesets-2026] Rulesets in 2026

SHOW: Nine dated rows, oldest first. Preview rows are purple.

February 17: the required reviewer rule went GA. Reviewers by team and by file path, inside the ruleset, working alongside CODEOWNERS rather than replacing it.

May 7: individual users as bypass actors on repository rulesets, in the UI, REST and GraphQL. And the branch rename control we just covered.

June 4: enterprise teams went GA, and that put them in the bypass picker of every organization.

June 30, preview: restrict code coverage. A branch ruleset can block a merge below a minimum line coverage or beyond a maximum drop from the default branch. It needs GitHub Code Quality and coverage uploads, and it only sees coverage that is already uploaded, so make the upload's status check required too. Since September 18 the REST API manages it as code coverage, with minimum coverage and max coverage drop.

July 7: restrict who can dismiss reviews, inside the pull request rule, GA for repository rulesets. Without it, anyone with write access can dismiss a blocking review. That was one of the last reasons to keep a classic rule.

August 11: convert to ruleset.

August 25, two things. The rule insights dashboards went GA at repository and organization level. And push rules gained allowed exceptions, in preview: block star dot jar everywhere except the Gradle wrapper, or adopt a file size limit while exempting the files that already exceed it. Only restrict file paths and restrict file size take exceptions.

September 9, preview: require secret scanning alerts are resolved. The pull request cannot merge until a scan finished on the head commit and no alert is open for a secret the pull request introduced. Provider, custom and generic patterns; not AI-detected secrets. It is the backstop for secret types you chose not to block at push time, and we come back to it after the break.

September 29, preview: external custom properties as targets.

The aside names two changes next to rulesets. Stacked pull requests, preview since July 30, are evaluated as if every pull request targeted the stack's base, and a pull request merges only when everything below it also qualifies. The asynchronous merge API went GA on October 1; it is the only API that merges a stack, and its bypass flag bypasses only what the caller may already bypass. If you run a merge bot, update it before your teams adopt stacks.

CHECK: Four rows are previews: coverage, path exceptions, secret scanning resolution, external properties. Confirm each before delivery.

> Lab 3 builds the repository ruleset.

SOURCE: https://github.blog/changelog/2026-02-17-required-reviewer-rule-is-now-generally-available
https://github.blog/changelog/2026-05-07-repository-rulesets-user-bypass-and-branch-renaming
https://github.blog/changelog/2026-06-04-enterprise-teams-is-now-generally-available
https://github.blog/changelog/2026-06-30-github-code-coverage-merge-protection-for-pull-requests
https://github.blog/changelog/2026-09-18-manage-the-code-coverage-ruleset-condition-with-the-rest-api
https://github.blog/changelog/2026-07-07-restrict-who-can-dismiss-reviews-in-rulesets
https://github.blog/changelog/2026-08-11-automatically-migrate-branch-protection-rules-to-repository-rulesets
https://github.blog/changelog/2026-08-25-rule-insights-dashboard-generally-available
https://github.blog/changelog/2026-08-25-push-rules-in-rulesets-now-support-path-exceptions
https://github.blog/changelog/2026-09-09-block-pull-requests-with-exposed-secrets-from-merging
https://github.blog/changelog/2026-09-29-bring-business-context-with-external-custom-properties
https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview
https://github.blog/changelog/2026-10-01-github-async-merge-api-generally-available

## [lab03] Lab 3 · Repository rulesets

LAB: Fifteen minutes. Share the lab link in chat.

Lab 3, fifteen minutes, labs slash lab03.

You will create a branch ruleset called default-branch-protection and set it to Active on purpose, so you can test it. Bypass: Repository admin, for pull requests only. Target the default branch. Require a pull request with one approval, dismiss stale approvals, code owner review and conversation resolution. Require the build status check, up to date. Leave Restrict deletions and Block force pushes on.

You are done when the ruleset is listed as Active, editing a file on main forces you onto a branch and into a pull request, and the merge box shows review required and build required.

If no build check appears in the picker, section 3.4 has a ten-line workflow: commit it to main, wait for one run, and the check shows up. If you are alone and nobody can approve, use the admin bypass you configured, and watch it appear in Rule insights.

DEMO: Create the ruleset on your screen up to the bypass list, then let the room work.

TIME: Call two minutes before the end.

> Lab 6 lifts the same idea to the organization.

## [lab06] Lab 6 · Advanced rulesets

LAB: Fifteen minutes. Sections 6.1 to 6.3 only; 6.4 and 6.5 are self-paced.

Lab 6, fifteen minutes, labs slash lab06. You need organization owner on the workshop organization; everyone here has it.

You will create an organization branch ruleset, prefixed with your handle so you do not collide: all repositories, all branches, signed commits and linear history, in Evaluate. Then a tag ruleset, also prefixed: v star, restrict creations, updates and deletions, with Maintain as the bypass actor. Then you test. Push to main under Evaluate and watch it succeed and get recorded. Switch to Active and watch it block.

You are done when both rulesets show Active in the organization list, Rule insights shows the Evaluate entry and the Active block, and only a Maintain user can create a v tag.

If time permits: 6.4 exports the ruleset as JSON and imports a recipe from the ruleset-recipes repository. 6.5 is the side-by-side with classic branch protection.

DEMO: Show the organization Rulesets page and the Evaluate option, then let the room work.

TIME: Call two minutes before the end.

> Then ten minutes away from the screen.

## [break2] Break

Ten minutes. The agenda has the exact return time; press A on your copy. When we come back: security, and what it costs.

DO: Start the break timer in the speaker window. Blank the screen with B if you step away.
