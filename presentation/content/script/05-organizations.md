# Script · Organizations

## [sec-orgs] Organizations

Welcome back. We move one level down, from the enterprise to the organizations inside it. Four stops: how everything nests inside the enterprise, where user accounts live and what consumes a license, how single sign-on and credentials work, and the current best practices.

Three takeaways. How collaboration works within an enterprise and its organizations. The communication patterns, and their limits, inside an organization. And GitHub's current guidance for organizations and teams.

> One picture, built up in five steps.

## [hierarchy] Everything exists inside the enterprise

SHOW: The enterprise frame, empty. Each press of Next adds a layer.

Every enterprise customer has an enterprise at github.com slash enterprises slash the slug. Enterprise owners manage it. It holds members, organizations, policies, licenses and the audit log. On GHE.com it lives on your own subdomain, and the API moves with it.

CLICK: Reveal the two organizations.

Organizations. Each has its own namespace, settings, roles and teams, and inherits the enterprise policies. The blue one and the purple one are silos: separate at-mentions, separate search, separate settings. We said earlier: create them on purpose.

CLICK: Reveal the repositories.

Repositories belong to the organization. Visibility plus the base permission decides who sees them. Notice blue slash docs is public, blue slash api is internal, blue slash web is private: three different audiences in one organization.

CLICK: Reveal the teams.

Teams live in organizations and carry permissions onto repositories. At blue slash java with Write on the api repository. At blue slash security as a code owner. And on the right, an enterprise team, ent colon sre, assigned into purple as well, so one definition serves both organizations.

CLICK: Reveal the people.

People keep their own accounts. Ana is a member of both organizations and consumes one license. Ben is an outside collaborator on one private repository; he consumes a license too, and base permissions never apply to him. Chen is unaffiliated: inside the enterprise, in no organization, no license by default.

CLICK: Reveal SSO.

And SSO wraps the organizations. Enforced at the enterprise, it covers every organization, and personal tokens and SSH keys have to be authorized before they can reach SSO-protected content.

> Let us put numbers on the accounts and licenses.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-best-practices/organize-work
https://github.blog/changelog/2026-06-04-enterprise-teams-is-now-generally-available

## [users-namespaces] Users, namespaces and licenses

Where accounts live. On github.com an account is personal and belongs to the user. With managed users it belongs to the enterprise and is limited to it. On Server it is corporate and isolated from the public.

Licenses. A member of three organizations consumes one license per enterprise. Outside collaborators with access to a private or internal repository consume one too, and since November 2025 the license CSV shows which organization and repository each collaborator's license comes from, which ends a lot of arguments with finance. Unaffiliated users consume none by default. In a managed-user enterprise, outside collaborators are called repository collaborators and must themselves be managed accounts.

Namespaces. A repository under the organization is governed: policies, teams, internal visibility, rulesets. A repository under a user's own namespace is not. The enterprise repository-creation policy can stop members creating repositories in their own namespace, and in most enterprises it should.

And one reminder that trips people up: enterprise owners are not automatically organization owners. Being an enterprise owner gives you policy and billing control. To administer a specific organization you join it as an owner.

> Now the part your security team cares about: sign-in and credentials.

SOURCE: https://github.blog/changelog/2025-11-17-improved-enterprise-license-consumption-reporting-for-outside-collaborators-now-generally-available
https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-roles-in-your-enterprise/abilities-of-roles
https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-repository-management-policies-in-your-enterprise#enforcing-a-policy-for-repository-creation

## [sso-credentials] SSO and credentials

Two layers of authentication: the GitHub sign-in, then your identity provider. Which protocol depends on the platform. Personal-account enterprises use SAML at the organization or the enterprise; enforcing it at the enterprise applies one configuration everywhere. Managed-user enterprises use SAML or OIDC, and OIDC is Entra ID only, which is what lights up Conditional Access. Server uses SAML, LDAP or CAS.

Two-factor authentication is mandatory for contributors on github.com. It is not required for managed users or Server users, who authenticate through the IdP or the instance. Prefer phishing-resistant methods: passkeys and security keys.

Now, what needs SSO authorization. Personal access tokens, classic and fine-grained, and user SSH keys: yes, every one, per organization. OAuth and GitHub App user tokens: automatic while the user has an active SSO session. Deploy keys and installation tokens: no, they never go through SSO. Since September 16, an enterprise with enterprise-level SSO can let an enterprise-installed GitHub App authorize an existing classic token or SSH key for up to fifty organizations in one call, instead of each developer clicking through organization by organization. It is opt-in, and that app becomes a privileged identity, so treat it like one.

DEMO: In your personal settings, SSO and Organizations are now two separate pages, since July 13. Use the SSO page to show credential authorization.

The incident response toolkit, all from this year. A credential inventory with CSV export. Bulk revocation by user, or by token type, at the enterprise or the organization. Self-service revocation for members, from June 24. And the automatic one: personal tokens and OAuth tokens unused for a year are still revoked for you.

> Which brings us to the practices GitHub now recommends.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/using-saml-for-enterprise-iam/configuring-saml-single-sign-on-for-your-enterprise
https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/configuring-authentication-for-enterprise-managed-users/about-support-for-your-idps-conditional-access-policy
https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/github-credential-types
https://github.blog/changelog/2026-09-16-automate-sso-authorization-for-classic-pats-and-ssh-keys
https://github.blog/changelog/2026-07-13-separate-sso-and-organizations-pages-in-settings
https://github.blog/changelog/2026-09-21-github-enterprise-adds-credential-inventory-exports
https://github.blog/changelog/2026-08-18-credential-revocation-and-deauthorization-by-token-type
https://github.blog/changelog/2026-06-24-self-service-credential-revocation-for-incident-response
https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation

## [org-best-practices] Enterprise best practices

Organizations. Create them intentionally, grouping related work or similar governance. Have multiple owners, and GitHub's docs are specific: never fewer than two. Enforce SSO and 2FA. And the hardened setup many companies run: base permission No permission, internal and private repositories by default, forking off.

People and teams. GitHub's current guidance is to use enterprise teams as the main way to add people to organizations, grant licenses and delegate access. Sync teams to IdP groups so the directory is the source of truth. Delegate administration through roles so you need only a handful of enterprise owners. Collaborate in organization-owned repositories, and practice innersource.

Teams themselves deserve the next fifteen minutes, because they are where most of your day-to-day administration happens.

> Why teams, and how to nest them.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-best-practices/organize-work
https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/enterprise-fundamentals/teams-in-an-enterprise
