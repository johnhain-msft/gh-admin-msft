# Script · Permission flow

## [sec-permissions] Permission flow

This section is the permission flow. We cover roles at the enterprise, the organization and the repository. Policies and how they are inherited. What changes when you have more than one organization, and where enterprise teams fit. Then repository visibility and base permissions.

What I want you to take away: you can tell the enterprise, organization, team and repository levels apart. You can pick the right role for the right person. You understand what visibility means. And you know how base permissions change who can see what across an organization.

> One diagram holds the whole flow. Let us walk it top to bottom.

## [permissions-flow] From enterprise policy to repository role

SHOW: The permissions flow diagram. Hovering a box dims everything else at that level.

DO: Walk the left column top to bottom, then the roles column, then the two feeders on the right.

Start at the top. The enterprise has policies. A policy controls the options an organization has. You can leave it unenforced, so each organization owner decides. Or you can enforce one value across every organization. Base permission is the classic example: enforce Read everywhere, or let each owner choose. By default, no enterprise policy is enforced.

The organization has settings. It can add restrictions. It cannot weaken a value the enterprise enforced.

The repository has settings. Same rule again. If a repository admin cannot find a setting, it is usually set, and locked, one level up.

Now the roles column, and these are the current ones. Enterprise roles: enterprise owner, billing manager, app manager, security manager, which is in public preview, and custom enterprise roles. Enterprise members are organization members or unaffiliated users. Guest collaborators exist only with managed users.

Organization roles: owner, member, moderator, billing manager, security manager, GitHub App manager, and predefined roles such as CI/CD admin. And custom organization roles. Since February 23 this year, the enterprise can define a custom organization role once and organization admins assign it everywhere.

Repository roles: Read, Triage, Write, Maintain, Admin, plus custom repository roles.

Two feeders on the right. Enterprise teams, defined once at the enterprise, assigned into organizations, roles, licenses, cost centers and bypass lists. Organization teams, the ones you nest and use in CODEOWNERS. And collaborators: outside collaborators in a personal-account enterprise, repository collaborators with managed users. Outside collaborators do not go through SSO; that remark applies only to personal-account enterprises.

Two arrows into the repository roles show how people get them. Team permissions, when a team is granted a role on a repository. And individual access, when a person is granted one directly.

One operational note: enterprise owners also manage support entitlements. GitHub's support portal moved to help.github.com starting September 8; support.github.com keeps working during the rollout.

CHECK: The security manager enterprise role is in public preview. Confirm its status before delivery.

> Now what changes with more than one organization.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise/abilities-of-roles
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization
https://github.blog/changelog/2026-02-23-enterprise-defined-custom-organization-roles-are-generally-available
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/security-and-compliance/enterprise-policies
https://github.blog/changelog/2026-09-08-new-customer-portal-help-github-com

## [multi-org] More than one organization

Each organization is a silo. Its own settings, roles, teams, at-mentions and search. All of them inherit the enterprise policies. Separate SAML per organization is possible only in a personal-account enterprise that does not enforce SAML at the enterprise; enforcing it at the enterprise applies one configuration everywhere, and managed-user enterprises authenticate the whole enterprise through one IdP anyway.

Now the guidance, because it changed in October 2025 and a lot of us still quote the old version. The old advice was "one organization". GitHub's current page, Best practices for organizing work in your enterprise, says five things.

Use organizations to group related work, or similar governance requirements. Create organizations intentionally; in GitHub's words, don't try to fit unnatural pieces of your company together into a single large organization. Start with a small number and add as the need arises, because adding is easier than removing. At-mentions and search still work best inside one organization. And use enterprise teams and roles to organize people at scale.

So the new sentence is: as few as make sense, and on purpose.

ASK: How many organizations do you have today, and which of them were created on purpose? One line in chat.

> Enterprise teams are what make "few organizations, many groups" workable. Here they are.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-best-practices/organize-work
https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise

## [enterprise-teams] Enterprise teams and roles

Enterprise teams went GA on June 4. You define a team once and assign it to organizations, to enterprise, organization and repository roles, to Copilot licenses, to cost centers, and to ruleset bypass lists. With managed users, the identity provider drives the membership through SCIM. You mention one as the organization name, slash, ent colon, the team slug, and you can request its review on a pull request in every organization it is assigned to.

The limits: two thousand five hundred teams per enterprise, five thousand members per team, a thousand organizations per team. The gaps: no CODEOWNERS, no nesting, no secret teams, no team maintainers, no project boards. For those you keep organization teams. Lab 16 walks through planning one, and it has an organization-owner path.

The roles card. Enterprise owner, billing manager, app manager. The enterprise security manager, in public preview since October 2025. Custom enterprise roles, which since November 2025 can carry View or Manage enterprise AI controls, so you delegate Copilot governance without making someone an enterprise owner. And enterprise-defined custom organization roles, GA February 23.

CHECK: The enterprise security manager role is still in preview. Confirm before you present.

> Next, the setting that decides who sees a repository at all.

SOURCE: https://github.blog/changelog/2026-06-04-enterprise-teams-is-now-generally-available
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-fundamentals/teams-in-an-enterprise
https://github.blog/changelog/2025-10-23-managing-roles-and-governance-via-enterprise-teams-is-in-public-preview
https://github.blog/changelog/2025-11-03-delegate-ai-controls-management-to-members-of-your-enterprise
https://github.blog/changelog/2026-02-23-enterprise-defined-custom-organization-roles-are-generally-available

## [visibility] Repository visibility

Visibility here means the repository's own setting combined with the base permission set at the organization or the enterprise. Three values.

Public: anyone on the internet. Enterprises with managed users, and so every GHE.com enterprise, cannot create public repositories at all.

Internal: every enterprise member who belongs to at least one organization. This is the innersource default, and it is the one reason to put code in the enterprise rather than in a personal account. Outside collaborators, repository collaborators and unaffiliated users do not see internal repositories. Guest collaborators, which are EMU only, get limited access by default.

Private: only people with explicit access, through a team, a direct grant, or an organization role such as All-repository read.

The callout is a role you may not have met. Unaffiliated users, GA since October 28, 2025, are enterprise members who belong to no organization. They do not consume a GitHub Enterprise license by default. They cannot reach private or internal repositories. They can hold a Copilot Business license or a custom role. And people removed from every organization now stay in the enterprise as unaffiliated users instead of disappearing.

> Visibility is half the story. The base permission is the other half, and the next slide lets you try the combinations.

SOURCE: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility
https://github.blog/changelog/2025-10-28-unaffiliated-users-for-ghec-accounts-now-generally-available
https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise/abilities-of-roles

## [base-permissions] Base permission × visibility

SHOW: The interactive grid. The three buttons set the organization's base permission; the cells show which repositories every member reaches.

What is a base permission? It is the permission every member of the organization gets on every repository the organization owns. Read the grid by row: a filled circle means every member reaches that kind of repository. A dashed circle means members reach it only through a team, direct access, or an organization role.

CLICK: Leave it on No permission first.

With No permission, every member still reads public and internal repositories. Private repositories need a team, direct access or a role. This is the typical enterprise setup, with internal or private as the default visibility: nobody gets access they were not given.

CLICK: Select Read.

With Read, every member can read every repository the organization owns, private ones included. Pushing still needs a team or direct access. Common in smaller organizations that want everything discoverable.

CLICK: Select Write / Admin.

Write or Admin means every member can push to, or administer, every repository. Almost never what an enterprise wants, and worth checking today in any organization you inherited.

Two footnotes. Base permissions never apply to outside collaborators. And internal repositories stay readable even when the base permission is No permission.

> Once someone can see a repository, the role decides what they can do in it.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/permissions-of-predefined-organization-roles

## [repo-roles] Repository roles

Five built-in roles, from least access to most.

Read is read-only on code and Actions. Read users can submit and comment on issues, pull requests and discussions. It is for non-code contributors who want to follow or discuss the project.

Triage is Read plus managing issues, pull requests, discussions, assignments and labels. For the people who organize work without pushing code: product managers, support, community managers.

Write is everything except repository settings. That is your standard developer role.

Maintain adds some settings: topics, enabling features, configuring merges and Pages, and pushing to protected branches. For project leads who manage the repository without sensitive or destructive actions.

Admin is everything, including access, rulesets, security settings and deleting the repository. Keep it rare.

Custom repository roles fill the gaps, up to five per organization. Lab 9 builds a contractor role and a security-reviewer role.

Now tie it back to the diagram. Every member starts at the organization's base permission. If someone with admin access grants a member a higher role, directly or through a team, the higher role wins. Organization owners have Admin on every repository the organization owns.

The most common mistake I see is Admin everywhere. If someone needs to push and configure Pages, that is Maintain. If they need to push, that is Write.

ASK: Who here has audited how many people hold Admin on their busiest repository? Keep that thought for Lab 13, where you will script exactly that report.

> That is the model. Now let us look at the console where you set it: enterprise administration.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/managing-custom-repository-roles-for-an-organization
