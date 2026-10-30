# Script · Security in the cloud

## [sec-security] Security in the cloud

SHOW: Section slide with five chips.

Welcome back. This section is security, from the administrator's chair. The products and what each one includes, because the packaging changed again this year. Push protection, the one feature that prevents instead of detects. Code scanning and Dependabot. Security configurations, which is how you turn all of it on at scale. And the cost model, because active committers are the question I get asked most.

What I want you to take away: you can say what Secret Protection, Code Security and Code Quality each cost and include. You can explain push protection to a developer in one minute. And you can roll security out with a configuration and a budget, not repository by repository.

> Start with the shopping list.

## [security-products] What you buy, and what is free

Four cards. Three you pay for, one you do not.

GitHub Secret Protection, nineteen dollars per active committer a month. Secret scanning with over two hundred partner patterns, push protection, custom patterns for your own token formats, validity checks, delegated bypass, and public monitoring, in preview since July 1, which watches public github.com for secrets attributed to your enterprise through membership or verified domains.

GitHub Code Security, thirty dollars. CodeQL code scanning, Copilot Autofix, which does not use AI Credits, dependency review on pull requests, security campaigns, and custom Dependabot auto-triage rules. Both products are sold separately, on GitHub Team and GitHub Enterprise, and there is no bundle discount: both together is forty-nine.

GitHub Code Quality, ten dollars per active committer, since July 20, plus AI Credits for its AI features and Actions minutes for its scans. It is a separate product with its own license count and its own enterprise policy; the Advanced Security policies do not control it. It is not on Server. And billing started automatically at GA for everyone who had the preview on, so check where it is enabled.

Dependabot is free on every plan: the dependency graph, alerts, security updates, version updates and malware alerts.

The dated callout is a vocabulary change you will hit in the UI. On July 10 GitHub renamed two detector types. Non-provider patterns are now Generic patterns: private keys, connection strings, found by deterministic patterns. Copilot secret scanning is now AI-detected secrets: passwords and other unstructured secrets found by AI, part of Secret Protection, no Copilot license needed. Nothing changed in detection, webhooks, audit events or the API. Runbooks and training that use the old names are what changed.

All of it is free on public repositories, which matters for the cost slide. And if you are sizing a purchase: self-serve trials of both products are open to enterprises with up to three hundred licenses since September 9, up from one hundred, and to GitHub Team since September 30.

CHECK: Public monitoring is a preview, and data residency was not supported at launch. Confirm before delivery.

> The feature that prevents rather than detects: push protection.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security
https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available
https://github.blog/changelog/2026-07-10-clearer-names-for-secret-scanning-detector-types
https://github.blog/changelog/2026-07-01-secret-scanning-public-monitoring-for-enterprises
https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts
https://github.blog/changelog/2026-09-09-github-advanced-security-expands-trial-availability
https://github.blog/changelog/2026-09-30-github-advanced-security-trials-for-github-team

## [push-protection] Push protection

SHOW: The push protection flow. Hover a box to highlight it.

DO: Walk left to right: developer, scan, the two outcomes.

A developer commits and pushes. At push time GitHub scans every commit in the push for secrets. Partner patterns, which are free on public repositories. Generic patterns, custom patterns and AI-detected secrets, which need Secret Protection.

Top branch, a secret was found. The push is rejected, and the terminal says which secret type, which file, which line. The developer removes the secret and pushes again, or bypasses with one of three reasons: it is used in tests, it is a false positive, I will fix it later. Owners can remove reasons, and many remove "fix it later". Or you require delegated bypass: the developer requests, a reviewer team approves, and the push waits. Every bypass is audit-logged and raises a secret scanning alert, so the exception is visible, not silent.

Bottom branch, the push was clean. It is still watched. Secret scanning keeps running on history and on new commits, and alerts show on the repository and on the organization overview. And since September 9, in preview, a ruleset rule, Require secret scanning alerts are resolved, blocks a pull request from merging until a scan finished on the head commit and no alert is open for a secret it introduced. Provider, custom and generic patterns, not AI-detected secrets. Use it for secret types you chose not to block at push time.

Three operational details from this year. Since March 23, push-protection exemptions can be set from repository settings. Since April 14, in managed-user enterprises, a user-owned fork inherits push protection from the nearest licensed ancestor, so personal forks are covered without their own license. And the same day a batch of patterns became push-protected by default, Cloudflare and GCP among them, so a developer may be blocked on a token type that passed last year.

Lab 7 triggers a block on purpose, with a known test key, so everyone sees the message once before a real one.

CHECK: The merge-protection rule is a preview. Confirm before delivery.

> What runs after the push: code scanning and Dependabot.

SOURCE: https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection
https://docs.github.com/en/code-security/secret-scanning/using-advanced-secret-scanning-and-push-protection-features/delegated-bypass-for-push-protection/about-delegated-bypass-for-push-protection
https://github.blog/changelog/2026-09-09-block-pull-requests-with-exposed-secrets-from-merging
https://github.blog/changelog/2026-03-23-push-protection-exemptions-from-repository-settings
https://github.blog/changelog/2026-04-14-secret-scanning-pattern-updates-and-product-improvements

## [code-scanning-dependabot] Code scanning and Dependabot

Left column, code scanning. Default setup is the way to enable CodeQL: GitHub detects the languages, runs on pushes and pull requests to the default branch, and weekly on active repositories. Since October 1 the initial validation scan no longer counts as activity, so a configuration rollout does not wake up dormant repositories; if you want dormant code scanned, an organization setting since June 9 scans inactive repositories every thirty days.

The change that retires advanced setup for most teams: since August 4 you customize default setup with a repository property, github dash codeql dash config dash file, pointing at a CodeQL configuration file. Add queries, exclude paths, set threat models. Give the property an organization-wide default, decide whether repositories may override it, and keep one configuration in a central repository. GitHub now recommends this over a workflow file in every repository.

Agentic autofix, preview since July 10. Where Copilot cloud agent is available, the free Generate fix button became Assign to Copilot. The agent explores the code, re-runs CodeQL to validate its fix, and opens a draft pull request. Each run is a cloud agent session: AI Credits plus Actions minutes. The enterprise Copilot Autofix policy turns off both the classic and the agentic kind, so budget before you leave it on.

And a small one that matters for audits: since August 20 an alert can be dismissed as Mitigated, meaning the code is still vulnerable but a firewall or network policy covers it. Map it into your risk-acceptance process; it is not Won't fix.

Right column, Dependabot. Alerts, security updates that open a fix pull request when an advisory lands, and version updates on a schedule from dependabot dot yml. Since July 14, version updates wait three days after a release reaches its registry, a default cooldown you can change; security updates are never delayed. Malware alerts flag dependencies that match known malicious packages, and since July 28 the Advisory Database ingests OpenSSF malicious-packages advisories, so coverage reaches PyPI and beyond npm. Since April 7 an alert can be assigned to an agent, Copilot or a third party, which opens its own draft pull request; it needs Code Security and a Copilot plan with cloud agent access. And since September 25, Dependabot alerts closed two or more years ago live in a CSV archive, not the API, so compliance scripts that read old closed alerts need the archive.

CHECK: Agentic autofix is a preview. Confirm its status and billing before delivery.

> All of that is turned on with one object: a security configuration.

SOURCE: https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql
https://docs.github.com/en/enterprise-cloud@latest/code-security/concepts/code-scanning/repository-properties
https://github.blog/changelog/2026-08-04-customize-code-scanning-default-setup-at-scale
https://github.blog/changelog/2026-10-01-scheduled-code-scanning-skips-inactive-repositories
https://github.blog/changelog/2026-06-09-periodic-code-scanning-of-inactive-repositories
https://github.blog/changelog/2026-07-10-agentic-autofix-for-code-scanning-alerts-in-public-preview
https://github.blog/changelog/2026-08-20-code-scanning-adds-a-mitigated-alert-dismissal-reason
https://github.blog/changelog/2026-07-14-dependabot-version-updates-introduce-default-package-cooldown
https://github.blog/changelog/2026-07-28-dependabot-alerts-on-malicious-packages-across-more-ecosystems
https://github.blog/changelog/2026-04-07-dependabot-alerts-are-now-assignable-to-ai-agents-for-remediation
https://github.blog/changelog/2026-06-30-cloud-data-retention-policy-for-closed-security-alerts

## [security-configurations] Security configurations

A security configuration is a bundle of security features that you apply to many repositories at once. GitHub recommended turns on the sensible defaults. A custom configuration picks exactly which features: dependency graph, Dependabot alerts and updates, secret scanning with push protection, code scanning default setup, private vulnerability reporting. Apply it to all repositories or to a selection, and set one as the default for new repositories, so nothing is created unprotected. Enterprise configurations push the same bundle to every organization.

Three dated changes.

April 21: the organization API fields that enabled features for new repositories, the enabled-for-new-repositories family and the validity-checks flag, were retired. A script that still sets them does nothing. The replacement is a default configuration, through the UI or the configurations API.

May 28: hard license budgets. Once an Advanced Security budget is reached, the product cannot be enabled on more repositories, so a configuration applied to a new batch stops at the budget. Existing repositories keep working.

September 15: enforcement. A configuration's enforcement setting now has three values: do not enforce, enforce for repository owners, enforce for repository and organization owners. Before that date an organization owner could still change what the enterprise set. Now the enterprise can set a floor nobody below can lower. Features the configuration leaves unset are not enforced, so set every feature you care about explicitly.

Lab 7 enables features on one repository so you see each switch. In your enterprise, do it with a configuration.

> One more slide before the lab: the number finance will ask you about.

SOURCE: https://docs.github.com/en/code-security/concepts/security-at-scale/about-security-configurations
https://github.blog/changelog/2026-04-21-deprecation-of-security-related-organization-api-fields
https://github.blog/changelog/2026-05-28-hard-budget-limits-now-available-for-github-advanced-security
https://github.blog/changelog/2026-09-15-enforce-github-advanced-security-configurations

## [ghas-cost] The cost model

Three tiles, and the third one is the whole model. Nineteen for Secret Protection, thirty for Code Security, per active committer a month. An active committer is anyone who pushed at least one commit in the last ninety days to a repository where the product is enabled.

Left column, who counts. Once, however many repositories they touch: a developer in twenty enabled repositories is one license. GitHub App bots are excluded. Automation that commits with a personal access token is a user, and it counts; move it to a GitHub App. Fork committers count toward the upstream only when their commits are merged in. And the ninety-day window starts at the last commit, not on the day you disable the feature, so disabling a repository today still bills its unique committers for up to ninety days. Archive repositories as they go quiet so committers age out. Public repositories are free, so enable everything there.

Right column, how to spend less on purpose. Tier the estate. Tier 1, critical and regulated: both products. Tier 2, standard: Secret Protection only, because leaked credentials hurt every repository. Tier 3, low risk: Dependabot, which is free. For a hundred developers that is the difference between about fifty-nine thousand dollars a year for everything and about thirty-four thousand tiered; at five thousand developers the gap is over a million.

Before buying, run the free risk assessments: the secret risk assessment, and since April 8 the code security risk assessment, up to twenty repositories with CodeQL, both repeatable every ninety days. Since May 19 a trial, or the products themselves, can be started from the assessment page.

Then a budget. Since May 28 an Advanced Security budget can be a hard limit in license count: when it is reached, the product cannot be enabled on more repositories until the budget rises or a cycle ends. Repositories that already have it keep working, and new committers there are still billed, so spend can still exceed the number. Alerts fire at seventy-five, ninety and one hundred percent either way. Set the budget before the rollout, not after the invoice.

And cost centers. Advanced Security is license-based, so each committer's cost goes to one cost center: direct assignment first, then enterprise team membership since June 25, then the oldest organization, then the enterprise. Put enterprise teams in cost centers and attribution follows the identity provider.

ASK: Which tier would your busiest repository land in, and who would sign off on its bypass list? Keep the answer for the action plan.

> Lab 7: turn it on, break it on purpose, read the result.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security
https://github.blog/changelog/2026-04-08-code-security-risk-assessment-available-for-organizations
https://github.blog/changelog/2026-05-19-start-a-github-advanced-security-trial-from-a-risk-assessment
https://github.blog/changelog/2026-05-28-hard-budget-limits-now-available-for-github-advanced-security
https://github.blog/changelog/2026-06-25-assign-enterprise-teams-to-cost-centers

## [lab07] Lab 7 · Security scanning and push protection

LAB: Twenty minutes. Sections 7.1 to 7.4; 7.5 is optional.

Lab 7, twenty minutes, labs slash lab07.

You will enable Secret Protection and push protection in Settings, Advanced Security. You will push a branch with the AWS-format test key from the lab, read the block message, and either remove the secret or bypass it and then close the alert. You will enable CodeQL default setup and keep working while it runs; the first scan can take a few minutes. And you will read a Dependabot alert, including the difference between a security update and a version update.

You are done when Secret Protection and push protection both show Enabled, you triggered and resolved one push protection block, one CodeQL analysis completed with alerts open, and the Dependabot alerts page loads.

The warning on the slide: push protection only blocks when the organization is licensed for Secret Protection, whatever the toggle says. I have checked the workshop organization. If a push goes through unblocked, the test key must start with AKIA exactly.

Section 7.5, auto-triage rules, is optional: start with the preset that dismisses low-severity alerts on development dependencies.

DEMO: Run the push on your screen so everyone sees the block message once, then let the room work.

TIME: Call two minutes before the end.

> When you are back: the API, and which credential to use for it.
