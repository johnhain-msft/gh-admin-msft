# Script · Enterprise administration

## [sec-enterprise-admin] Enterprise administration

Now enterprise administration. We walk the settings together, in your enterprise. Then AI controls, which is where Copilot and agents are governed. Then the two Copilot defaults that changed this autumn, and seats and budgets.

What I want you to take away: understand each setting and the reason you would turn it on. Know every policy an enterprise owner has. And be able to spot a misconfiguration when you see one.

> Please share your screen on your enterprise account.

## [enterprise-walkthrough] Enterprise settings walkthrough

DEMO: The customer shares their enterprise account. Ask for areas of concern first and start there, then move through every tab.

Are there settings you are worried about? We start there. Then I will walk the rest of the tabs in order, and the slide lists what is new in each one.

DO: Open Organizations, then People.

On the People tab the new items are unaffiliated users, enterprise teams, and enterprise roles including custom roles. Dormant users and the license reports live here too; we come back to them before the first lab of the afternoon.

DO: Open Policies.

Under Policies, three things to check. Personal access tokens: you can restrict classic tokens, require approval for fine-grained tokens, and set a maximum lifetime for both. The default maximum for fine-grained tokens is 366 days. Repositories, then deploy keys: disabling deploy keys disables existing ones, so warn the pipeline owners first. Actions: SHA pinning, blocking, and workflow execution protections, which went GA on September 17. And the Code Quality policy, added March 3.

DO: Open GitHub Connect, then Settings.

Under Settings, Profile has the security contact email for incident notifications, and member appearance, which shows profile names next to handles. Authentication security has enterprise access restrictions and the IP allow list, including the managed-user namespaces. The Credentials page is new this year: an inventory, a CSV export since September 21, and bulk revocation. Automated SSO authorization for classic tokens and SSH keys arrived September 16. Proof of presence is here too, as a preview. And GitHub Apps: enterprise-owned apps and enterprise installations, which are a preview.

DO: Open Compliance.

Compliance has AI controls, GA since February 26. That is the next slide. Billing and licensing we covered. Security and quality, renamed on April 2; the Advanced Security administration comes with the organization settings. Insights holds the Copilot usage dashboards. And the Identity provider tab for managed-user enterprises.

CHECK: Proof of presence and enterprise app installation are previews. Confirm before delivery.

> Let us open AI controls now, because it is the newest tab and the one with deadlines attached.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise
https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise
https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions
https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available
https://github.blog/changelog/2026-03-03-github-code-quality-enterprise-policy
https://github.blog/changelog/2025-09-15-security-contact-for-security-notification-emails-is-generally-available
https://github.blog/changelog/2026-02-13-you-can-now-show-profile-names-alongside-user-handles
https://github.blog/changelog/2026-09-21-github-enterprise-adds-credential-inventory-exports
https://github.blog/changelog/2026-09-16-automate-sso-authorization-for-classic-pats-and-ssh-keys
https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available

## [ai-controls] AI controls · the agent control plane

AI controls is the enterprise tab for Copilot and agent governance, GA since February 26.

What lives here. Copilot policies, split into features and clients, and models. The Agents page, with the policies for Copilot cloud agent, code review and third-party agents. MCP server policies, and an enterprise-wide MCP allowlist from a central registry URL, still in public preview. Managed settings: the managed-settings.json file in the .github-private repository of the organization you pick as configuration source, GA July 1. And audit: every audit entry now carries actor is agent, and the agent session task event records when an agent session starts, finishes or fails.

You can delegate all of this. Grant View or Manage enterprise AI controls on a custom enterprise role and assign the role to people or to an enterprise team.

Now the right column, because these are dated, and the dates have passed.

August 26: the global model policy went GA. Models you did not configure follow the default policy, and the default is on.

September 28: the Default effort for Copilot code review now means Balanced.

The unified Copilot experience was announced for no earlier than September 28. Copilot Chat on github.com, Chat in GitHub Mobile and Copilot cloud agent become one experience under one policy, enabled by default, and chat data on github.com is then kept for the life of the account. Check whether it has landed in your enterprise before you present.

And October 22, one week ago. The Default policy for new features took effect. GA features that were left Unconfigured now follow it, and it ships Enabled. If your intention was "unconfigured means off", that intention stopped being true on the 22nd. The next slide is what to do about it.

CHECK: Unified Copilot experience: confirm whether it is live. MCP allowlist and enterprise-team model targeting are previews: confirm status.

> Decide the defaults first, then the features.

SOURCE: https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available
https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies
https://github.blog/changelog/2026-08-26-global-model-policy-generally-available
https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available
https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing
https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise
https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/enterprise/default-availability
https://github.blog/changelog/2025-11-03-delegate-ai-controls-management-to-members-of-your-enterprise

## [copilot-policies] Copilot policies: decide the defaults, then the features

Two defaults now govern everything you did not configure.

The first is Default availability for released models, on since August 26. Newly GA models, and any model you never touched, follow it. Open-weight models like Kimi, and models outside GitHub's data retention agreement, are excluded regardless.

The second is the Default policy for new features, in effect since October 22. Eligible GA features left Unconfigured follow it, including Copilot code review and MCP servers, and the policy ships Enabled. If "unconfigured" must mean off in your enterprise, set this policy to Disabled, or configure each feature explicitly. Preview features stay opt-in.

And the base model. Organizations that have not approved any model get GPT-5.3-Codex, GitHub's first long-term-support model, available through February 2027.

The right column is the review list. Public code matching: block it unless legal has said otherwise. Copilot cloud agent, agent mode and MCP servers: security review before you turn them on, because they act on repositories. Third-party agents are a preview, and Copilot Memory and Store local sessions in the Cloud deserve a read of doc 12 first. Two that are on by default and surprise people: bring-your-own-key in VS Code, and Copilot vision, which keeps image attachments for about a day. And organization-billed Copilot CLI in Actions bypasses user budgets, so a budget alone will not cap it.

The warning at the bottom is the distinction people miss. Policies decide who gets a feature. Managed settings decide how the clients behave once they have it: blocking bypass mode, MCP allow and deny lists, the default model, OpenTelemetry export, deny-ask-allow permissions for agent operations. Doc 29 explains them and Lab 17 builds one.

> Last part of this block: seats and money.

SOURCE: https://github.blog/changelog/2026-07-29-default-model-enablement-for-copilot-business-and-enterprise
https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise
https://github.blog/changelog/2026-05-17-gpt-5-3-codex-is-now-the-base-model-for-copilot-business-and-enterprise
https://github.blog/changelog/2026-04-22-bring-your-own-language-model-key-in-vs-code-now-available
https://github.blog/changelog/2026-07-01-copilot-vision-is-generally-available
https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions
https://github.blog/changelog/2026-06-17-enterprise-managed-settings-now-support-bypass-permission-controls
https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings
https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations

## [copilot-seats] Seats, budgets and content exclusions

Assignment first. All members is simple and expensive. Selected members or teams is the right shape for a phased rollout. Direct enterprise assignment lets you grant Copilot Business seats at the enterprise, to users or, since June, to enterprise teams. And self-service lets people request their own. Turn on automatic seat reclamation: seats unused for thirty days or more come back to the pool.

Spend. Each Business seat brings nineteen hundred included AI Credits a month and each Enterprise seat thirty-nine hundred, pooled across the enterprise. Beyond the pool, budgets govern: per-user budgets, cost-center budgets, pools, expiry dates, and member budget-increase requests, which are not available with managed users. Code review on private repositories also uses Actions minutes.

Content exclusions. Glob patterns such as dot env, secrets, PEM files, Terraform variable files. They take up to thirty minutes to reach the IDE clients. They are enforced in completions, chat, Copilot CLI, the Copilot app and code review. They are not enforced in agent mode or edit mode in the IDE, and third-party agents are not covered. If exclusion compliance is critical, disable those modes separately. Enterprise-level exclusions apply to every organization and cannot be overridden.

My rollout advice in one breath: pilot teams, reclamation on, exclusions and budgets set before anyone gets a seat, then expand on the usage dashboards.

ASK: What is your biggest Copilot governance worry: cost, public code, or agents acting on repositories? That tells me what to emphasize in the lab.

> Let us do all of this hands-on. Lab 15.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies
https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans
https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers
https://github.blog/changelog/2026-09-16-copilot-budget-increase-requests-are-generally-available
https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-organization/manage-copilot-content-exclusions

## [lab15] Lab 15 · Copilot governance configuration

LAB: Fifteen minutes. Share the lab link in chat.

Lab 15, fifteen minutes. Open labs slash lab15 in the repository.

You will read the enterprise and organization Copilot policies and record what Unconfigured means today. You will review seat assignment and reclamation. You will add a content exclusion and check where it applies. And you will query seats and usage with gh api.

You are done when you can state the two defaults and their current values, a content exclusion exists for a sensitive path, and the seats endpoint returns your organization's seats.

If you are an organization owner without enterprise access, the organization path covers every step; the enterprise AI controls you have already seen on my screen.

DEMO: Drive the first three steps on your screen, then let the room work. Watch chat.

TIME: Call two minutes before the end.

> When you are back, grab a coffee: ten minutes.

## [break1] Break

Ten minutes. The agenda has the exact return time; press A on your copy. When we come back: organizations, the people in them, and how they sign in.

DO: Start the break timer in the speaker window. Blank the screen with B if you step away.
