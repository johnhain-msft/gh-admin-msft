---
section: Organizations
day: 1
---

@id: sec-orgs
@layout: section
@minutes: 1

# Organizations

:::chips
- Everything inside the enterprise
- Users, namespaces, licenses
- SSO and credentials
- Best practices
:::

{{GH-100 · Manage identities and access · Administer the environment}}

---

@id: hierarchy
@layout: default
@minutes: 5

# Everything exists inside the enterprise

:::diagram hierarchy
:::

---

@id: users-namespaces
@layout: default
@minutes: 3

# Users, namespaces and licenses

:::cards 3
:::card Where accounts live
- **github.com**: personal, owned by the person
- **EMU**: owned by the enterprise, limited to it
- **GHES**: corporate, isolated from the public
:::card One license per enterprise
- A member of three organizations consumes **one** license
- Outside collaborators on private or internal repositories consume one too; the license CSV shows which repository grants it
- Unaffiliated users consume none by default
:::card Namespaces and ownership
- `github.com/ORG/repo` is governed; `github.com/user/repo` is not
- A repository-creation policy can stop members creating repositories in their own namespace
- Enterprise owners are **not** automatically organization owners
:::

---

@id: sso-credentials
@layout: default
@minutes: 4

# SSO and credentials

:::cols 1fr 1fr
:::col Two layers of authentication
- GitHub sign-in, then your IdP
- Personal-account enterprises: **SAML** at the organization or the enterprise; enterprise-level overrides organization-level
- EMU: **SAML or OIDC**; OIDC is Entra ID only and enables Conditional Access
- GHES: SAML, LDAP or CAS
- 2FA is mandatory for contributors on github.com; prefer passkeys and security keys
:::col What needs SSO authorization
- PATs (classic and fine-grained) and user SSH keys: **yes**
- OAuth and GitHub App user tokens: automatic in an active session
- Deploy keys and installation tokens: **no**
- Since 2026-09-16 an enterprise-installed app can authorize classic PATs and SSH keys, 50 organizations a call
:::

:::callout tip Incident response toolkit, 2026
Credential inventory and CSV export · bulk revocation by user or token type · self-service revocation for members · PATs and OAuth tokens unused for a year are revoked automatically.
:::

---

@id: org-best-practices
@layout: default
@minutes: 2

# Enterprise best practices

:::cols 1fr 1fr
:::col Organizations
- Create them intentionally; group related work or similar governance
- Have **multiple owners**, never fewer than two
- Enforce SSO and 2FA
- The common hardened setup: base permission *No permission*, internal and private by default, forking off
:::col People and teams
- Use **enterprise teams** as the main way to add people to organizations, grant licenses and delegate access
- Sync teams to IdP groups
- Delegate administration through roles, so you need few enterprise owners
- Collaborate in organization-owned repositories; practice innersource
:::
