# Script · Repository governance

## [day2-welcome] Welcome back

SHOW: Four recap lines, then today's two columns.

Good morning, and welcome back. Yesterday we worked the top of the hierarchy: the enterprise, the organizations, the people and the teams. Today we go down to the repository, where the rules meet the work.

Four sentences from yesterday, because everything today stands on them.

Policies cascade down, and nobody can weaken them from below. When a repository admin cannot find a setting, it is usually set, and locked, one level up. You will see that again on the settings walkthrough in ten minutes.

Visibility plus base permission decides who sees a repository. Roles decide what they do in it. Rulesets sit on top of that: they decide what even a Write user may do to a branch.

Defaults are on now. Models since August 26, Copilot features since October 22. If you changed a Copilot policy overnight, good.

Teams carry access, and the identity provider should carry the teams. Today enterprise teams come back twice: as bypass actors in rulesets, and as cost-center members for security licenses.

Keep those four in your head. I will point back to them whenever a ruleset or a security configuration behaves in a way that surprises you, because it is almost always one of the four.

ASK: Did anyone look at their own enterprise last night and find something they want to raise? One line in chat; I will pick it up in the matching block.

Here is the shape of the morning. Repository governance first: the landing page, a settings walkthrough on your screen, and templates as a governance tool. Then rulesets, the longest block of the day, at repository and organization scope, with two labs back to back. After the break, security: the products and what they cost, push protection, code scanning and Dependabot, security configurations, and the active-committer model, because that is the question I get asked most. Then the API and authentication, Actions and the Marketplace, and a short close on privacy, licenses and repository health.

If you are preparing for GH-100, today is mostly the Secure SDLC and compliance domain, the largest at twenty-five to thirty percent, and Actions at twenty to twenty-five.

Six labs, and they are the point of the day. Lab 4 is templates, ten minutes. Labs 3 and 6 are rulesets, fifteen minutes each. Lab 7 is security scanning, twenty minutes; it needs Secret Protection and Code Security on the workshop organization, and I have checked that they are on. Lab 5 is the API. Lab 13 is scripting with the gh CLI. When I run behind, I trim my talking, not your lab time. The self-paced labs for today's topics are listed at the end, each with an organization-owner path.

Two practical notes for the labs. Everything happens in the shared workshop organization, so prefix anything you create at organization level with your handle; Lab 6 says so explicitly. Where a step needs an enterprise owner, the lab has an organization-owner path, or you watch it on my screen. And at the end of the day you write a thirty-day action plan. Open a note now and add to it as we go; the best items come out of the labs, not out of me.

Same working rules as yesterday. Ask in chat at any time; I read it at every slide change. If it is urgent, unmute.

DO: Confirm the recording is running and post the lab repository link in chat again.

> Let us start with the repository itself.

SOURCE: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-100
https://github.blog/changelog/2026-08-26-global-model-policy-generally-available
https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise

## [sec-repos] Repository governance

SHOW: Section slide with four chips.

This section is the repository-level view. The landing page, and what it tells you about the permissions of the person looking at it. The settings page, which we walk on your screen. And templates, which most people file under developer convenience and I file under governance.

What I want you to take away: you can read a repository page and know what the person in front of you is allowed to do. You know which settings are repository-local and which ones are decided above. And you leave with a standard, a template repository with issue forms, a pull request template, CODEOWNERS and custom properties, so a new repository is compliant on the day it is created.

> The landing page first, because it is where every user starts.

## [repo-landing] The repository landing page

SHOW: Two columns: what the page tells you, and what was renamed or added.

Start with the tabs, because they are a permission readout. The tabs a person sees depend on their role. Settings appears for Maintain and Admin. Only Admin gets every setting on it. So when someone says "I cannot find Settings", you do not open a ticket; you check their role.

The tabs also follow the features. Disable Issues, Wiki, Projects or Discussions in Settings and the tab disappears. That is the first governance lever on a repository: fewer features, fewer places for untracked work.

The README renders on the page automatically. It is the front door, and the template repository we build in Lab 4 ships one. From here people switch branches and tags, create and delete files in the browser, and press T for the file finder. The right rail has the about block, releases, packages and contributors. Insights, one tab over, holds the dependency graph, which is the data source for Dependabot alerts after the break.

One more readout, next to the repository name: the visibility label. Public, internal or private. Internal is the one that opens the repository to every enterprise member, as we saw yesterday, and it is the label I look at first when someone asks why a colleague in another organization can read their code.

Now the right column, oldest first.

January 26: the Agents tab joined the navigation. Your developers will ask what it is before you have read about it, so read about it.

April 2: the Security tab became Security and quality, at repository, organization and enterprise level. In the repository sidebar, Vulnerability alerts became Findings, Policy became Security policy, and a Code quality section appeared. URLs and APIs did not change, so bookmarks and scripts kept working. Screenshots did not. Every runbook that says "Security tab" is mislabeled on github.com, and Server did not get the rename.

September 21: the refreshed pull requests page went GA. Bulk close and label, milestones, linked issues, author badges, filtering by review status, and full profile names where the enterprise shows them.

The aside is the practical point. Old bookmarks work. Old screenshots do not. If your internal wiki has a screenshot of the Security tab, it is six months out of date, and so is the training built on it.

The takeaway: the landing page is the fastest permission check you have. Before you change anyone's role, look at what they can see.

> Now the page where administrators spend most of their time.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization
https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository
https://github.blog/changelog/2026-04-02-the-security-tab-is-now-security-quality
https://github.blog/changelog/2026-09-21-refreshed-repository-pull-requests-page-generally-available

## [repo-settings] Repository settings walkthrough

DEMO: The customer shares a repository they administer. Ask for areas of concern first and start there, then move through the sidebar groups in order. Change nothing.

Which settings worry you? We start there. Then I take the sidebar top to bottom, and the four cards list what is new in each group.

Two things before we click. Only a repository Admin can manage everything on this page. And repository settings inherit from, or are locked by, organization and enterprise settings. If a toggle is greyed out, somebody above you decided it.

DO: Open General.

General is features and housekeeping. The feature toggles: issues, pull requests, wiki, discussions, projects. Three of them grew governance controls this year. Since February 13 you can disable pull requests, or let only collaborators open them. Since June 29 issue creation can be collaborators only, and since August 3 the triage role is included. Since June 17 you can cap how many open pull requests a user without write access may have, with a bypass list, and since August 6 that cap can be set once for the whole organization. Commit comments can be switched off, and the organization can make that the default since April 23. Immutable releases, GA since October 2025, are here too.

Lower down: the template repository checkbox, the merge methods, auto-delete head branches. Then the danger zone. Deleting a repository removes team permissions, and deleting a private repository deletes every fork of it. Some deletions can be restored within ninety days; do not plan on it. This one page also shows the difference between two roles: Maintain sees the feature toggles and the merge settings, Admin sees the danger zone.

DO: Open Collaborators and teams, then the Code, planning, and automation group.

Collaborators and teams is yesterday's diagram applied: base permission, plus visibility, plus direct grants. Prefer teams; individual grants do not survive a reorganization. Moderation options sit next to it: interaction limits, and the open-pull-request cap we just saw, which the organization can also set once under Moderation tools.

Under Code, planning, and automation: Branches still holds classic branch protection rules, and since August 11 each one has a Convert to ruleset button. Tags holds the classic tag protection list, which tag rulesets replace; Lab 6 builds one. Rulesets is where new rules go, and that is the next section. Actions inherits the organization policy, and repository runners can live here. Environments is where deployment approvals and protection rules live. Pages, and Custom properties, which the organization defines and the repository fills in; a required property without a value is the first thing to check when a ruleset does not apply.

DO: Open the Security & quality group.

Advanced Security is the tab that used to be called Code security and analysis. Secret Protection and push protection, with push-protection exemptions configurable from repository settings since March 23. Code scanning, Dependabot and its auto-triage rules, private vulnerability reporting. Most of this is set by a security configuration at the organization, and that is where I would set it. Deploy keys: read-only by default, write access is one checkbox, audit who holds them. Secrets and variables: environment secrets first, repository secrets second.

DO: Open Integrations, then Copilot.

GitHub Apps are installed at the organization; here you only see which ones reach this repository. Webhooks are for automation when an app is too much, and the setup can be scripted. Email notifications on push are rarely used. Autolink references turn ticket keys into links; few people know it exists. Under Copilot: cloud agent firewall and runner settings, which the organization can control since April 3, and code review. Code quality has its own settings now that it is a separate product.

One moderation tool to know: since July 16 admins can archive pull requests. Archived ones are closed, locked, and visible to admins only.

The takeaway for this page: if you would set something the same way in more than three repositories, do not set it here. Set it at the organization: a security configuration, an organization ruleset, or an organization default. Repository settings are for the exceptions.

CHECK: Confirm the sidebar group names on the customer's screen match the cards before you present; GitHub renamed them twice this year.

> Templates next: the cheapest governance you will buy today.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features
https://github.blog/changelog/2026-02-13-new-repository-settings-for-configuring-pull-request-access
https://github.blog/changelog/2026-06-29-restrict-issue-creation-to-collaborators-only
https://github.blog/changelog/2026-08-03-triage-role-can-bypass-issue-creation-restrictions
https://github.blog/changelog/2026-06-17-limit-open-pull-requests-for-users-without-write-access
https://github.blog/changelog/2026-08-06-set-pull-request-limits-at-the-organization-level
https://github.blog/changelog/2026-04-23-disable-commit-comments-across-your-organization
https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available
https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository
https://github.blog/changelog/2026-08-11-automatically-migrate-branch-protection-rules-to-repository-rulesets
https://github.blog/changelog/2026-03-23-push-protection-exemptions-from-repository-settings
https://github.blog/changelog/2026-04-03-organization-firewall-settings-for-copilot-cloud-agent
https://github.blog/changelog/2026-04-03-organization-runner-controls-for-copilot-cloud-agent
https://github.blog/changelog/2026-07-16-repository-admins-can-archive-pull-requests

## [templates-governance] Templates are governance

Four cards, one idea: decide the standard once, and let every new repository inherit it.

Issue forms. YAML files in dot github, ISSUE_TEMPLATE. The front matter names the template and sets labels and assignees. The form fields can be required, so a bug report arrives with the version, the steps and the impact instead of "it is broken". Put the organization's defaults in the dot github repository, and every repository without its own templates uses them.

The pull request template. One Markdown file, dot github, pull_request_template dot md. GitHub also looks in the root and in docs, in that order, and uses the first one it finds. It is the checklist every change answers before a reviewer spends a minute: what changed, how it was tested, what it touches. Two lines in that checklist save more review time than any tool.

Template repositories. Tick Template repository in General, and the green Use this template button appears. A repository created from it inherits the whole tree: the dot github folder, the workflows, CODEOWNERS, SECURITY dot md, the Dependabot configuration. That is how a new repository is compliant on the day it is created. One template per stack is the pattern that scales; one monolithic template is the pattern teams prune badly.

CODEOWNERS and custom properties, the purple card. CODEOWNERS maps paths to teams. The last matching line wins, so put the broad patterns first and the sensitive paths last. It only enforces something when a ruleset says Require review from Code Owners, which Lab 3 does. Dependabot's own reviewers option was removed in August 2025; CODEOWNERS is the replacement. And enterprise teams cannot be code owners, so keep organization teams for this.

Custom properties are the other half. The organization defines them: environment, compliance level, a true-false for internet-facing. Mark them required, give them defaults, and define the shared ones at the enterprise so every organization uses the same vocabulary. Then rulesets, Code Quality enablement and the repository filters target by property instead of by naming convention. Since September 29, in preview, a CMDB or developer portal can own those values through a GitHub App; they show read-only in GitHub.

The tip at the bottom is the standard I would ship: community health files in the dot github repository, one template repository per stack, required properties with defaults.

ASK: Who has a template repository today, and when was it last updated? If the answer is "last year", that is the first item on your action plan.

CHECK: External custom properties are a preview. Confirm the status before delivery.

> Lab 4 builds the first two pieces.

SOURCE: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository
https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
https://github.blog/changelog/2025-08-08-dependabot-reviewers-configuration-option-is-replaced-by-code-owners
https://docs.github.com/en/organizations/managing-organization-settings/managing-custom-properties-for-repositories-in-your-organization
https://github.blog/changelog/2026-09-29-bring-business-context-with-external-custom-properties

## [lab04] Lab 4 · GitHub templates

LAB: Ten minutes. Share the lab link in chat.

Lab 4, ten minutes, labs slash lab04.

You will add an issue template from Settings, General, Features, Set up templates. You will commit a pull request template to main. And if you have time, you mark the repository as a template and create a new one from it.

You are done when a new issue offers your template, the pull request template file exists, and a new pull request opens with the template already in the description.

The note on the slide: the Features section also holds Creation allowed by, the collaborators-only switch for issues. Look at it, leave it alone; the shared workshop repository needs issues open.

DEMO: Open Set up templates on your screen and pick Bug report, then let the room work.

TIME: Call two minutes before the end.

> When you are back: rulesets, the longest block of the day.
