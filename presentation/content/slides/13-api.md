---
section: API and authentication
day: 2
---

@id: sec-api
@layout: section
@minutes: 1

# API and authentication

:::chips
- The core integration loop
- REST and GraphQL
- Credentials and token prefixes
- Which access method
:::

{{GH-100 · Manage identities and access · Administer the environment}}

---

@id: core-loop
@layout: default
@minutes: 2

# The core integration loop

:::diagram core-loop

---

@id: rest-graphql
@layout: default
@minutes: 2

# REST and GraphQL

:::cols 1fr 1fr
:::col REST · calendar versions
- `X-GitHub-Api-Version: 2026-03-10` · newest, first with breaking changes
- `2022-11-28` · still the default, supported for at least 24 months
- Actions endpoints: REST only
:::col GraphQL · `POST /graphql`
- One query, nested data, only the fields you name
- Resource limits per query since 2025-09-01
- In-docs Explorer removed 2025-11-07: use `gh api graphql`
:::

:::kv
Personal access token, OAuth token | 5,000 requests an hour per user
GitHub App installation token | 15,000 an hour on GitHub Enterprise Cloud
`GITHUB_TOKEN` | 1,000 an hour per repository · 15,000 for GHEC resources
:::

---

@id: credentials
@layout: default
@minutes: 3

# Credentials: read the prefix

:::cards 4
:::card Personal access token
`github_pat_` fine-grained · `ghp_` classic

Personal use only. Policy: restrict classic, approve fine-grained, cap lifetime (366 days default).
:::card [muted] OAuth App
`gho_` access token

Acts as the user. 8-hour tokens with 6-month refresh since 2026-08-14. Prefer a GitHub App.
:::card [good] GitHub App
`ghu_` user · `ghr_` refresh · `ghs_` installation

Recommended: own identity, fine-grained permissions, no license. Stateless ~520-character `ghs_` JWTs since 2026-10-02.
:::card GITHUB_TOKEN
`ghs_` installation token

One per job, expires with the job. Events it triggers start no new runs. Use it first inside Actions.
:::

:::callout dated Deploy keys, machine users and SSH
RSA keys **≥ 3072 bits** since 2026-10-14 · `ssh-rsa` SHA-1 brownouts **2026-11-04** and **2026-12-09**, removed **2027-01-13** · `X-GitHub-Stateless-S2S-Token` header deprecated **2026-11-30**
:::

---

@id: auth-decision
@layout: default
@minutes: 2

# Which access method?

:::diagram auth-decision

:::aside
Inside Actions: `GITHUB_TOKEN` first. Deploy keys for pull-only deployments. Machine users only when nothing else works.
:::

---

@id: lab05
@layout: lab
@minutes: 15
@lab: 5

# Lab 5 · GitHub API with REST and GraphQL

:::labtile
5 | 15 minutes | labs/lab05.md
:::

:::cols 1fr 1fr
:::col You will
- Extend `use-github-apis.yml` so the REST job creates an issue and closes it with `actions/github-script`
- Add a GraphQL job that returns labels and their issues in one query
- Run both from the Actions tab, authenticated with `GITHUB_TOKEN`
:::col Done when
- The REST job created and closed an issue
- The GraphQL job printed the repository's labels
- Both jobs show a green check in the Actions tab
:::

:::callout tip `ubuntu-latest` is moving to 26.04 until 2026-11-19
These jobs only call the API. If a run behaves oddly, pin `runs-on: ubuntu-24.04` and compare.
:::
