# Script · Enterprise overview

## [sec-enterprise] Enterprise overview

SHOW: Section slide with five chips.

This first section is the big picture. Platforms. Data residency and managed users. The plans, and the products you buy on top of them. What is pay per use. And how you manage that spending.

Here is what I want you to take away. You can tell the three platforms apart and say which one fits a given constraint. You know what you are paying for, and in which unit. And you can name the two or three billing controls you should set before anyone else in your company touches the enterprise.

> Three ways to run GitHub Enterprise. Let us start there.

## [platforms] Three ways to run GitHub Enterprise

SHOW: Three cards: GitHub Enterprise Cloud, GHE.com data residency, GitHub Enterprise Server.

GitHub Enterprise comes in two offerings, and the cloud offering comes in two flavors.

Cloud first. Software as a service, minimal configuration, private but on the internet. This is where every new capability lands first, and sometimes only. The hierarchy is enterprise, organization, team, repository. Accounts belong to the person, except with Enterprise Managed Users, which we will get to in two slides.

The second card is the same cloud, in your region. GitHub Enterprise Cloud with data residency, called GHE.com, is generally available in four regions. The EU, which since May 1 this year also includes Azure regions in Norway and Switzerland. Australia. The US. And Japan, GA since December 18 last year. Each enterprise gets a dedicated subdomain on ghe.com. It always uses Enterprise Managed Users, and there are no public repositories. If someone asks about moving from Server to GHE.com, the answer is Enterprise Live Migrations, GA since September 1.

The third card is Server. On your network, self-managed, self-maintained, high-availability capable. Actions, Packages and Advanced Security all run on it.

Both are built to enterprise security standards. What differs is who owns the hardening. On Cloud that is GitHub. On Server it is your team. People assume on-premises means more secure. It means you do the patching.

One dated change on the purple callout. Since October 7, GHE.com rejects TLS clients that only offer X25519. If a corporate proxy or an old build agent stopped connecting to your ghe.com subdomain this month, that is why.

ASK: Show of hands in chat: who is on Cloud, who on Server, and does anyone run GHE.com? Calibrate your examples to the answer.

> Let us look at the cloud hierarchy and the two kinds of account.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency
https://github.blog/changelog/2026-03-31-eu-data-residency-region-expanding-to-include-efta-countries
https://github.blog/changelog/2025-12-18-github-enterprise-cloud-data-residency-in-japan-is-generally-available
https://github.blog/changelog/2026-09-01-enterprise-live-migrations-from-ghes-to-ghe-com-generally-available
https://github.blog/changelog/2026-09-30-x25519-only-tls-ends-for-ghe-com-on-september-15

## [ghec] GitHub Enterprise Cloud

CLICK: Reveal the four levels one at a time.

The enterprise at the top. Owners, policies, licenses, billing, and the audit log that sees everything.

Organizations next. Each one is its own namespace with its own settings, roles and teams. It inherits policy from the enterprise.

Teams. They group people, they carry permissions onto repositories, and they route notifications.

And repositories, where the work meets the rules.

Now the two kinds of account, because this decides half of your identity design. On github.com, an account belongs to the person. Your developer had it before you hired them, and they keep it after they leave. You grant and revoke access; you never own the identity. With Enterprise Managed Users, the account belongs to the enterprise. Your identity provider creates it, names it, and removes it.

One detail for your API scripts: on GHE.com, the API host moves too. It is api dot your subdomain dot ghe dot com.

> Managed users deserve their own slide, because they come with their own controls.

## [emu] Enterprise Managed Users

With EMU, the identity provider controls usernames, profile data, team membership and repository access. Managed user accounts can contribute only to private and internal repositories in their own enterprise, and to their own private repositories. They cannot create public content. They can fork only inside the enterprise, as policy allows. And instead of outside collaborators, you have repository collaborators, which are also managed accounts.

The right column is what arrived in the last year, oldest first.

Enterprise access restrictions, GA September 2025. Your corporate proxy injects a header, so only your enterprise's managed accounts can use github.com from your network. Since October 2025 that works with multiple enterprises.

Bulk credential deletion, February this year. During an incident you delete a user's tokens and keys in one action. EMU only.

IP allow lists covering the EMU user namespace, GA June 8. Personal repositories of managed users were a gap; they are not any more.

And proof of presence, public preview since September 24. Members re-authenticate with the identity provider before high-impact actions. It is EMU with Entra ID only, and I would re-check its status before you rely on it.

The callout at the bottom matters for Microsoft shops. OIDC works with Microsoft Entra ID only, and that is what lets Entra Conditional Access, device and location policies, apply to GitHub sessions.

CHECK: Proof of presence is a public preview. Confirm it has not changed before this delivery.

> Now the self-hosted option, and why it is not at feature parity.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts
https://github.blog/changelog/2025-09-15-enterprise-access-restrictions-with-corporate-proxies-is-now-generally-available
https://github.blog/changelog/2026-02-17-enterprise-wide-credential-management-tools-for-incident-response
https://github.blog/changelog/2026-06-08-ip-allow-list-coverage-for-emu-namespaces-in-general-availability
https://github.blog/changelog/2026-09-24-require-proof-of-presence-for-high-impact-actions
https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/about-support-for-your-idps-conditional-access-policy

## [ghes] GitHub Enterprise Server

Server is self-hosted infrastructure on your network, with isolated accounts, and it needs maintenance. Older decks said "near feature parity with Cloud". That is not true any more, and I would rather you hear the verified examples than a slogan.

GitHub Copilot is not available for Server. Release 3.22 adds only a technical preview of Copilot CLI with a self-configured model provider for air-gapped sites. GitHub Code Quality is not on Server. The Security and quality navigation is not on Server. And Server does not hold potentially malicious workflows for approval the way the cloud does.

Operating it. You keep it upgraded, and since August 18 GitHub refuses support bundles from appliances below the listed patch levels, so an old appliance also loses support tooling. The current release is 3.22, GA September 8, and it does bring enterprise teams.

Migration paths, if that is where you are headed. Enterprise Live Migrations from Server to GHE.com. GitHub Enterprise Importer with GitHub-owned blob storage, GA since November 2025, which removes the "bring your own storage bucket" step. And the Importer from GitLab, GA August 3.

When is Server still the right answer? Regulatory isolation that data residency cannot meet, or an air-gapped network. Otherwise the cloud is where the roadmap goes first.

> That is the platform decision. Now, what do you actually buy.

SOURCE: https://docs.github.com/en/copilot/get-started/plans
https://github.blog/changelog/2026-09-08-github-enterprise-server-3-22-is-now-generally-available
https://github.blog/changelog/2026-07-22-upcoming-ghes-change-impacting-uploading-support-bundles
https://github.blog/changelog/2025-11-17-migrating-repositories-with-github-owned-blob-storage-is-now-generally-available
https://github.blog/changelog/2026-08-03-migrate-from-gitlab-to-github-with-github-enterprise-importer

## [plans] Plans and add-on products

Start with the difference between a plan and an add-on. The plan is the platform. The add-ons are products you buy on top, and they are not enterprise-only, which is why the heading says Team and Enterprise.

The plans are GitHub Free, GitHub Team, and GitHub Enterprise, Cloud or Server. Note the name: GitHub Team, singular. Older material says Teams.

The add-ons. GitHub Advanced Security is now sold as two products: GitHub Secret Protection at nineteen dollars per active committer a month, and GitHub Code Security at thirty. Both can be bought on GitHub Team or GitHub Enterprise. The combined GHAS license still exists for some customers, and Advanced Security remains the umbrella name. GitHub Code Quality is a third, standalone product since July 20: ten dollars per active committer, plus metered usage, and not on Server.

Then Copilot. Business at nineteen a user, Enterprise at thirty-nine. Since October 2025, Copilot Business can be assigned from the enterprise account without a GitHub Enterprise license per user. And since October 1 this year, customers who pay by card or PayPal pay for each Copilot seat up front.

The dated callout is the one that changes your budgeting. Since June 1, every Copilot plan bills on GitHub AI Credits. Each seat includes a monthly allowance, pooled across the enterprise. Usage beyond the allowance is billed through budgets you control. Copilot code review on private repositories also consumes Actions minutes. If your finance team still models "premium requests", that model is four months out of date.

CHECK: Up-front seat payment for card and PayPal payers applied to existing customers from 2026-10-01. Confirm it landed as announced.

> Everything metered lives on the next slide.

SOURCE: https://docs.github.com/en/get-started/learning-about-github/githubs-plans
https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security
https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available
https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans
https://github.blog/changelog/2025-10-28-managing-copilot-business-in-enterprise-is-now-generally-available
https://github.blog/changelog/2026-09-03-reopening-copilot-business-and-enterprise-signups

## [pay-per-use] Pay per use

Four cards, four meters.

Actions. GitHub-hosted runners, standard and larger, beyond the included minutes, plus storage for custom images used with larger runners. Hosted-runner prices dropped by up to thirty-nine percent on January 1 this year. And since November 2025, Actions cache beyond ten gigabytes per repository is billed by usage.

Copilot. AI Credits beyond the included allowance, and Actions minutes for code review on private repositories, both since June 1. One more: code review on pull requests from contributors without a Copilot license is billed to the organization, since December 2025. That one surprises people when an open-source contributor's PR shows up on the invoice.

Packages and Codespaces. Packages bills storage and transfer. Codespaces bills compute while a codespace is active and storage while it exists, and prebuilds use Actions minutes. Organization and enterprise plans do not include a free Codespaces quota.

And the last card: Marketplace pay-per-use apps, Git LFS data packs, and GitHub Sponsors, which shares your account's billing date, payment method and receipt.

DO: Use the product names as written: GitHub Codespaces, GitHub Sponsors.

> So how do you keep all of that inside a number you agreed with finance? That is the next slide.

SOURCE: https://docs.github.com/en/billing/concepts/product-billing/github-actions
https://github.blog/changelog/2026-01-01-reduced-pricing-for-github-hosted-runners-usage
https://github.blog/changelog/2025-11-20-github-actions-cache-size-can-now-exceed-10-gb-per-repository
https://github.blog/changelog/2025-12-17-copilot-code-review-now-available-for-organization-members-without-a-license
https://docs.github.com/en/billing/concepts/product-billing/github-codespaces

## [billing-mgmt] Billing and licensing management

This is what you manage on the enterprise Billing and licensing tab. Three groups.

Budgets. Since September 2025, license-based budgets are set in license counts instead of dollar amounts. Advanced Security budgets can be hard limits, since May 28: once the budget is reached, enabling the product on more repositories is blocked. Per-user AI-credit budgets cap what each person can use, and a cost center can apply one per-user budget to all of its members. Email alerts go out when included usage for Actions, Packages, LFS and Codespaces reaches ninety and one hundred percent.

Cost centers. An enterprise can have up to a thousand of them since June 26. Enterprise teams can be members since June 25, so cost-center membership follows your team structure instead of a spreadsheet. AI-credit pools, from July 2, cap how much of the enterprise's included AI Credits a single cost center can draw.

Usage and APIs. Metered Enterprise usage is attributed to organizations, so the usage-by-organization views include it. License history is a public preview that shows a daily record of license adds and removals. The budget and usage-report APIs went GA on June 4.

The warning at the bottom is practical. The product-specific billing APIs were closed down on September 26, 2025. If a finance script still calls them, it stopped working a year ago and nobody noticed until the report was blank. Move it to the consolidated usage endpoint.

DO: Recap the section in two sentences: two platforms, three cloud flavors, and the unit each product bills in.

> With money understood, let us turn to who can do what: the permission flow.

SOURCE: https://github.blog/changelog/2025-09-02-updating-license-based-budgets-to-accept-license-counts
https://github.blog/changelog/2026-05-28-hard-budget-limits-now-available-for-github-advanced-security
https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers
https://github.blog/changelog/2026-06-26-cost-center-limit-increased-to-1000-per-enterprise
https://github.blog/changelog/2026-06-25-assign-enterprise-teams-to-cost-centers
https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps
https://github.blog/changelog/2026-06-04-budget-and-usage-management-apis-now-generally-available
https://github.blog/changelog/2025-09-26-product-specific-billing-apis-are-closing-down
