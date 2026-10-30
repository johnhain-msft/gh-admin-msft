---
section: Permission flow
day: 1
---

@id: sec-permissions
@layout: section
@minutes: 1

# Permission flow

:::chips
- Enterprise, organization and repository roles
- Policies and inheritance
- Multiple organizations and enterprise teams
- Visibility and base permissions
:::

{{GH-100 · Manage identities and access}}

---

@id: permissions-flow
@layout: default
@minutes: 4

# From enterprise policy to repository role

:::diagram permissions-flow
:::

---

@id: multi-org
@layout: default
@minutes: 2

# More than one organization

:::cols 1fr 1fr
:::col Each organization is a silo
- Its own settings, roles, teams, @-mentions and search
- All inherit the enterprise policies
- Separate SAML only in a personal-account enterprise that does not enforce SAML at the enterprise
:::col GitHub's current guidance
- Group **related work**, or **similar governance requirements**
- Create organizations **intentionally**: "don't try to fit unnatural pieces of your company together into a single large organization"
- Start **small** and add; adding is easier than removing
- Use **enterprise teams and roles** to organize people at scale
:::

:::callout note The old advice was "one organization". The current advice is "as few as make sense, and on purpose".
:::

---

@id: enterprise-teams
@layout: default
@minutes: 2

# Enterprise teams and roles

:::cards 3
:::card [purple] Enterprise teams · GA 2026-06-04
- Define once, assign to many organizations
- Carry enterprise, organization and repository roles
- Copilot licenses, cost centers, ruleset bypass lists
- Membership from the IdP through SCIM (EMU)
- Mention as `@org/ent:slug`
:::card Limits and gaps
- 2,500 teams an enterprise, 5,000 members a team, 1,000 organizations a team
- No CODEOWNERS, nesting, secret teams, team maintainers or project boards
- Keep organization teams for those
:::card Enterprise roles
- Enterprise owner, billing manager, app manager
- Security manager (public preview since 2025-10-23)
- Custom enterprise roles, including delegated AI-controls administration
- Enterprise-defined custom **organization** roles (GA 2026-02-23)
:::

---

@id: visibility
@layout: default
@minutes: 2

# Repository visibility

:::cards 3
:::card [bad] Public
Anyone on the internet. Not available in enterprises with managed users, which includes every GHE.com enterprise.
:::card [good] Internal
Every enterprise member who belongs to at least one organization. The innersource default. Not visible to outside collaborators, repository collaborators or unaffiliated users.
:::card Private
Only people with explicit access: a team, direct access, or an organization role such as *All-repository read*.
:::

:::callout note Unaffiliated users · GA 2025-10-28
Enterprise members who belong to no organization. They consume no GitHub Enterprise license by default, cannot reach private or internal repositories, and can still hold a Copilot Business license or a custom role.
:::

---

@id: base-permissions
@layout: default
@minutes: 2

# Base permission × visibility

:::diagram base-permissions
:::

---

@id: repo-roles
@layout: default
@minutes: 2

# Repository roles

:::kv
Read | Read-only. Submit and comment on issues, pull requests and discussions. For non-code contributors.
Triage | Read, plus manage issues, pull requests, discussions, assignments and labels. For people who organize work without pushing code.
Write | Everything except repository settings. The standard developer role.
Maintain | Write, plus some settings: topics, features, merges, Pages, pushing to protected branches. For project leads without destructive rights.
Admin | Everything, including access, rulesets, security settings and deletion. Keep it rare.
:::

:::callout tip The most common mistake
Giving everyone Admin when Write or Maintain would do. Every member starts at the base permission; a higher role granted directly or through a team wins. Organization owners have Admin on every repository.
:::
