# Script · Actions, automation and Marketplace

## [sec-actions] Actions, automation and Marketplace

SHOW: Section slide with five chips.

Second block of the hour: Actions from the administrator's side, then automation, then the Marketplace.

Five topics. Runners: hosted, self-hosted and the Actions Runner Controller. The Actions policies, including the supply-chain controls that arrived this year, one of them with a deadline four days from now. How to share workflows and actions inside the enterprise. The gh CLI patterns you will use in Lab 13. And the Marketplace, which has changed shape since most people last looked.

Take away three things. Which runner to recommend and what it costs. Which policy settings to check in every organization you inherit. And what to do about pull_request_target before November 2.

> Runners first, because that is where the money and the deadlines are.

## [runners] Runners

Three cards, three ways to run a job.

GitHub-hosted, the first card. GitHub owns the machine and the patching. Enterprise Cloud includes fifty thousand minutes a month, and hosted-runner prices dropped by up to thirty-nine percent on January 1. This year added options: ubuntu-slim, a one-vCPU container runner, GA January 22. arm64 standard runners in private repositories since January 29. Custom images for larger runners, GA March 26. Red Hat Enterprise Linux 9 and 10 images, public preview since June 25. The same day brought two admin controls: macOS runners can join runner groups, and you can disable the standard labels such as ubuntu-latest, which forces every job through a runner group you govern.

Self-hosted, the orange card, for teams with their own infrastructure and no metered bill. Keeping them current is now mandatory. A runner needs version 2.329.0 to register, and must install each new release within thirty days or it stops receiving jobs. Enforced on Enterprise Cloud since September 29. Node 20 was removed on September 23, so JavaScript actions run on Node 24. The per-minute platform charge announced last December was postponed; self-hosted minutes are still free.

The Actions Runner Controller, the purple card, scales self-hosted runners on Kubernetes and OpenShift. In runner-scale-set mode it is a GitHub product, supported within a defined scope: Helm installs, not your cluster or your network. Release 0.15.0 shipped on October 1.

Two dates on the timeline. ubuntu-latest is moving from Ubuntu 24.04 to 26.04 between October 19 and November 19. That is in progress right now, so pin critical workflows to ubuntu-24.04. And the macOS 14 image retires on November 2.

CHECK: The ubuntu-latest migration is in progress and macOS 14 retires 2026-11-02; confirm both. RHEL images are a preview. Confirm the self-hosted per-minute charge is still postponed.

> Now the settings that decide what those runners may run.

SOURCE: https://docs.github.com/en/billing/concepts/product-billing/github-actions
https://github.blog/changelog/2026-01-01-reduced-pricing-for-github-hosted-runners-usage
https://github.blog/changelog/2026-01-22-1-vcpu-linux-runner-now-generally-available-in-github-actions
https://github.blog/changelog/2026-01-29-arm64-standard-runners-are-now-available-in-private-repositories
https://github.blog/changelog/2026-03-26-custom-images-for-github-hosted-runners-are-now-generally-available
https://github.blog/changelog/2026-06-25-red-hat-enterprise-linux-runner-images-are-now-in-public-preview
https://github.blog/changelog/2026-06-25-more-control-over-your-github-hosted-runners
https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration
https://github.blog/changelog/2026-10-01-github-actions-macos-14-runner-image-retirement
https://github.blog/changelog/2026-09-28-self-hosted-runner-version-enforcement-date-has-moved
https://docs.github.com/en/enterprise-cloud@latest/actions/reference/runners/self-hosted-runners
https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions
https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions
https://docs.github.com/en/enterprise-cloud@latest/actions/concepts/runners/support-for-arc
https://github.blog/changelog/2026-10-01-actions-runner-controller-release-0-15-0

## [actions-policies] Actions policies and supply-chain controls

Actions policies exist at the enterprise, the organization and the repository, and like every other policy they only tighten on the way down.

The left column is the General section: four settings to check in every organization you inherit.

Allowed actions. Allow all, allow local only, or allow select. Under select you can limit to Marketplace actions by verified creators, and since August 15, 2025, you can block a specific action with an exclamation mark and require full-length commit SHA pinning.

Retention. The setting is now called Check, workflow run, status, artifact and log retention. Since October 1 it deletes checks, runs and commit statuses too, not only artifacts and logs. The default is ninety days. If an audit relied on a check run from last spring, it is gone unless you raised retention.

Fork pull request workflows: require approval before a first-time contributor's workflow runs.

And the GITHUB_TOKEN default. Enterprises created on or after February 2, 2023, default to read-only. Older enterprises default to read and write. Check, do not assume.

The right column is the Policies section and this year's supply-chain controls, oldest first.

April 10: fifty reruns per workflow, so retry bots hit a ceiling. June 18: actions/checkout version 7 refuses the common pwn-request checkout. June 26: a read-only cache for untrusted triggers, and since September 10 a cache-mode key for least privilege. July 15: repositories created, renamed or transferred after that date get an immutable OIDC subject claim, so an Azure federated credential that matched the old name-only subject must be updated. July 28: potentially malicious runs in public repositories are held for approval. September 17: workflow execution protections went GA. Allowlists of who and which events may start a workflow, per workflow file, with Evaluate mode and a Policy insights page that shows what would be blocked before you enforce. Doc 30 explains them and Lab 18 builds one.

And the orange row. Public repositories without an event policy got a default rule that blocks pull_request_target, in Evaluate mode since September 17. On November 2, four days from now, GitHub enforces it. Open Policy insights this week. For each flagged workflow, move it to pull_request, or allow pull_request_target explicitly for that one file.

CHECK: The 2026-11-02 enforcement of the default pull_request_target policy is upcoming. Confirm it landed as announced before you present.

> Policies restrict. The next slide is how you share the good workflows.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise
https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions
https://github.blog/changelog/2026-10-01-actions-retention-now-covers-checks-runs-and-statuses
https://github.blog/changelog/2026-04-10-actions-workflows-are-limited-to-50-reruns
https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout
https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers
https://github.blog/changelog/2026-09-10-control-github-actions-cache-access-with-cache-mode
https://github.blog/changelog/2026-04-23-immutable-subject-claims-for-github-actions-oidc-tokens
https://github.blog/changelog/2026-07-28-github-actions-holds-potentially-malicious-workflows-for-approval
https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available
https://docs.github.com/en/actions/concepts/security/github_token

## [sharing-workflows] Sharing workflows and actions

Left column, inside the enterprise. Workflow templates live in the organization's dot github repository, under workflow-templates. Since September 18, 2025, that repository no longer has to be public: an internal dot github serves internal and private repositories, a private one serves private repositories only. YAML anchors are supported since the same day. Reusable workflows use workflow_call. And a private or internal repository can share its actions and reusable workflows natively: Settings, Actions, General, Access, with the organization or with the entire enterprise.

Right column. You need an app token only to reach a repository outside the enterprise, and actions/create-github-app-token is the action for that. Then Agentic Workflows: Markdown automations compiled to ordinary Actions YAML, running under your existing runner groups and policies, in public preview since June 11. Decide whether you allow them before a team finds them.

CHECK: Agentic Workflows is a public preview. Confirm its status.

> Policies and sharing are the governance. gh is how you script it.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/reuse-automations/create-workflow-templates
https://github.blog/changelog/2025-09-18-actions-yaml-anchors-and-non-public-workflow-templates
https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/reuse-automations/share-with-your-enterprise
https://github.com/actions/create-github-app-token
https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview

## [gh-cli-automation] Scripting administration with gh

The gh CLI wraps both APIs, and on GitHub-hosted runners it is preinstalled and already authenticated through GITHUB_TOKEN. Three flags do most of the work. gh api takes any endpoint. Dash dash paginate follows the link headers for you. Dash dash jq filters the JSON. And gh api graphql sends a query with variables; the second command on the slide returns team names and member counts in one request.

Four patterns to script first, on the right. An access audit: every repository and the teams with access to it. Bulk team management: create, add members, grant a role. Audit log export to your SIEM, if you do not have enterprise streaming. And the dormant user report. Lab 13 does the first three; Lab 10 does the fourth.

The callout is a concept you need for rulesets. External CI reports back two ways. Commit statuses: one state per context string, posted with any token, the legacy and still common path. Check runs: GitHub Apps only, with annotations and Markdown summaries. A ruleset requires either one by its context name, so the name in the workflow must match the name in the rule exactly. And an external system that goes offline leaves the pull request blocked, which is the right failure mode.

ASK: What admin task would you automate first? Keep the answer for the lab's last question.

> One last stop before the lab: where the apps and actions come from.

SOURCE: https://cli.github.com/manual/
https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows
https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
https://docs.github.com/en/rest/commits/statuses
https://docs.github.com/en/rest/checks/runs
https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets

## [marketplace] Marketplace

Marketplace lists two things. Apps, meaning GitHub Apps and OAuth Apps: free, flat-rate or per-unit, and a paid listing needs a verified publisher. Organization owners decide who may install them and can require approval. And actions, which are free to list and governed by the allowed-actions policy, including the verified-creators filter.

The purple card is what changed. There is an Agent apps category since June 2: partner agents you install like any GitHub App, enable as an administrator, and then assign issues to. GitHub App based Copilot Extensions stopped working on November 10, 2025. MCP servers replaced them, and the GitHub MCP Registry, launched September 16, 2025, is where you find them. And GitHub Models was retired on July 30, so do not look for it.

DO: Open github.com/marketplace. Show Apps, Actions, the Agent apps category and a verified badge.

> Lab 13.

SOURCE: https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/about-github-marketplace-for-apps
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/limiting-oauth-app-and-github-app-access-requests
https://github.blog/changelog/2026-06-02-extend-github-with-agent-apps
https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps
https://github.blog/changelog/2025-09-16-github-mcp-registry-the-fastest-way-to-discover-ai-tools
https://github.blog/changelog/2026-07-30-github-models-is-now-retired

## [lab13] Lab 13 · Scripts and gh CLI automation

LAB: Fifteen minutes. Share the lab link in chat.

Lab 13, fifteen minutes, labs slash lab13. Sections 13.1 to 13.3 are the goal; the rest is extra.

You will check gh auth status, then list repositories, members and the organization's settings with gh api. You will create a team prefixed with your handle, add yourself, and grant it Write on a repository. And you will query the audit log for the team.create and repo.create events you just caused.

Done when the team's members endpoint lists you, the audit log shows your team.create event, and you have deleted the team again in 13.7.

If you finish early: 13.4 is the access-report script, 13.5 is the same data in one GraphQL request, 13.6 posts a commit status that a ruleset could require.

If gh api answers 403, run gh auth refresh with admin:org and repo.

DEMO: Run the first gh api call on screen so everyone sees the shape of the output.

TIME: Call two minutes before the end.

> Five minutes on three topics we have only touched: privacy, licenses and repository health.
