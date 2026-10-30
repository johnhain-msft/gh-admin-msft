# Script · Wrap-up

## [privacy-licenses-health] Privacy, licenses and repository health

Three cards, five minutes, and each one has a lab or a doc behind it.

Privacy and data residency first. GitHub Enterprise Cloud with data residency runs on your own subdomain of ghe.com, in four regions: the EU, Australia, the US and Japan. It is always managed users and there are no public repositories. Code, issues, Actions data and personal data stay in the region. Some data does not: billing, support cases and pseudonymized telemetry. And Copilot data stays in-region only when you enable the policy Restrict Copilot to data residency compliant models, which exists for the US and EU regions and costs ten percent more AI Credits. It is off by default. On the user side, people control their profile, whether private contribution counts show, and the noreply email address for commits. IP addresses appear in the audit log only when an enterprise owner enables disclosure. Doc 26 has the full data-boundary tables.

Seats, the orange card, because the invoice is where this topic becomes real. A license is consumed by every organization member, owners included. By every outside collaborator on a private or internal repository. By dormant users who are still members. And, outside EMU, by pending invitations. Not consumed: unaffiliated users, billing managers, suspended managed accounts, and guest collaborators who are in no organization. One person consumes one license across every organization and every Server instance in the enterprise. So the two levers are the dormant-user cleanup, Lab 10, and a hard look at who your outside collaborators are.

Repository health, the third card. Keep a repository under a gigabyte. Git warns at fifty mebibytes per file and blocks at one hundred. When large files are already in history, git-filter-repo is the tool GitHub and the Git project recommend; filter-branch is deprecated and BFG is legacy. After the rewrite, track the big binaries with Git LFS so it does not happen again, and remember that a rewrite invalidates every clone, so coordinate the force push. Stale branches: turn on Automatically delete head branches, in the repository settings under Pull Requests; it prevents most of the pile. And the end of life. Archive keeps everything read-only, searchable and forkable, and that is the default for anything someone might reference again. Transfer moves the repository and its history to another owner, with redirects. Delete only for repositories created in error, or when sensitive data cannot be purged any other way. Lab 14 runs the whole diagnosis.

ASK: Which of the three cards is your pain point? That decides which self-paced lab you start with.

> Five things to do this week.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency
https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-storage-of-your-data-with-data-residency
https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/displaying-ip-addresses-in-the-audit-log-for-your-enterprise
https://docs.github.com/en/enterprise-cloud@latest/billing/reference/github-license-users
https://github.blog/changelog/2025-10-28-unaffiliated-users-for-ghec-accounts-now-generally-available
https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
https://github.com/newren/git-filter-repo

## [top5] Top five things to implement this week

CLICK: Reveal the five one at a time.

Five things, in order of impact per hour of your time.

One. Organization rulesets on main: a pull request required, at least one review. Lab 3 built it.

Two. Secret Protection with push protection, organization-wide, through a security configuration. The single highest-impact control in the course.

Three. Audit log streaming to your SIEM. One hundred eighty days is not a compliance window.

Four. A least-privilege review of everyone who holds Admin. The Lab 13 access report is the script.

Five. SCIM provisioning from your identity provider, so joiners and leavers stop being tickets.

> Nine labs you have not done yet.

## [extension-labs] Nine self-paced labs

Nine labs we did not run live, in the same repository, with the same conventions: YOUR-ORG, YOUR-HANDLE, and a done-when checklist in each.

Labs 1 and 2 are short: webhooks through a smee channel, and the Actions settings of one repository. Labs 10, 11 and 12 take twenty to twenty-five minutes: the dormant user report, installing and reviewing a GitHub App, and deployment environments with approval gates. Lab 14 is the repository health diagnosis we just talked through. And 16, 17 and 18 are the three newest: enterprise teams, enterprise managed settings for Copilot, and workflow execution protections, which is the one to do before November 2.

Docs 20, 24, 25, 28, 29 and 30 are the background reading for them.

> Two questions before we finish.

## [day2-quiz] Knowledge check

ASK: Read the first question aloud. Thirty seconds, answers in chat, then click what the majority chose.

First question. A repository ruleset requires one review and an organization ruleset requires two. A pull request targets a branch covered by both. How many reviews?

PAUSE: Thirty seconds.

CLICK: The majority's answer, then B if they missed it.

B. Rulesets layer, and the strictest requirement across every applicable ruleset wins. Nothing takes precedence and nothing stacks.

ASK: Second question, same routine.

What is the difference between secret scanning alerts and push protection?

PAUSE: Thirty seconds.

CLICK: The majority's answer, then A.

A. Alerts are reactive: the secret is already in the history. Push protection is proactive: the push is refused. That is why number two on the top-five slide says push protection, not just scanning.

> Where to go from here.

SOURCE: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection

## [resources] Resources

Six places to go.

The reference card, in docs, has the URLs, the gh commands, the role tables, the audit log events and the decision matrix. The GitHub Docs for Enterprise Cloud are the source of truth. The GitHub Changelog is the one to subscribe to; almost every date in this deck came from it, and the next batch of announcements is Universe, this week. The GH-100 study guide on Microsoft Learn, if you want the certification; its skills changed in July. The GitHub Administration collection on Microsoft Learn is the structured path. And the post-workshop assessment, with the confidence checklist, the feedback form and the action plan.

DO: Post the assessment and reference card links in chat.

> Questions.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest
https://github.blog/changelog/
https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-100
https://learn.microsoft.com/en-us/collections/mom7u1gzjdxw03

## [qa] Questions

ASK: Open the floor. Anything from either day. Chat or unmute.

Anything from either day, Day 1 included. If it is easier, type it and I will read it out.

PAUSE: Give it a full minute before you move on.

DO: If nobody speaks, ask which of the top five they would struggle to get approved.

> One last thing, and it is for you.

## [thanks] Thank you

Last thing, and it is for you, not for me. Write down three things you will do in the next thirty days. For each one: what, by when, and who owns it. Specific. Not "improve security" but "push protection on every repository in the production organization by the end of next week".

PAUSE: Sixty seconds.

ASK: Two volunteers share one item each.

Thank you for two days. Everything is in the repository, the assessment is in chat, and the labs will still be there next week.

DO: Stop the recording. Post the assessment and reference card links once more.
