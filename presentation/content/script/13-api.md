# Script · API and authentication

## [sec-api] API and authentication

SHOW: Section slide with four chips.

Last hour of the course. Two short presentation blocks, two labs, and the wrap-up. This block is the API, and how you authenticate to it.

Four things. The core integration loop, which is the mental model for every integration you will build or approve. REST and GraphQL, and when to use which. Credentials: the token prefixes, and the dated changes to OAuth tokens, installation tokens and SSH keys. And an interactive decision tree for which access method to choose.

What I want you to take away: you can read a token prefix and say what it is. You can name the rate limit each one gets. And you default to a GitHub App unless you have a reason not to.

> Every integration starts with an event. Here is the loop.

## [core-loop] The core integration loop

SHOW: The core-loop diagram. Hovering a box dims the others.

DO: Walk the loop clockwise: GitHub, events, integrations, requests, API, and back along the bottom.

Start on the left, in GitHub. Every operation in an enterprise, an organization or a repository is an event. A push, a pull request, an issue, a release. A membership change, a settings change, a security alert.

Events leave GitHub three ways. Webhooks, at repository, organization or enterprise level. GitHub Apps, which subscribe to events for the repositories they are installed on. And Actions workflows, which run per repository.

The green box is your integrations. Scripts and the gh CLI. GUI clients. Third-party systems such as Jenkins or Jira. Web servers and serverless functions. And the workflows under dot github slash workflows. A webhook arrives as an HTTP POST to your endpoint. Validate the HMAC signature, queue the work, answer with a 2xx fast. That order is in doc 27, and most webhook outages come from getting it wrong.

The integration then makes requests against the purple box, the GitHub API. REST, with calendar versions. Or GraphQL, one query with nested data.

Now the arrow along the bottom, because it is the point of the slide. Requests that change GitHub fire new events. Automation that writes to GitHub triggers more automation. Design for the loop, or you will build one by accident: a bot labels an issue, which triggers a workflow, which comments, which triggers the bot.

ASK: Who has had an integration loop on itself? One line in chat.

> Two APIs sit in that purple box. Let us compare them.

SOURCE: https://docs.github.com/en/rest/about-the-rest-api/api-versions
https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api
https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#the-graphql-endpoint

## [rest-graphql] REST and GraphQL

Both APIs are shipped and supported. There is no published deprecation roadmap for REST, so do not promise one. Pick the API you know, or the one that has the endpoint you need. Actions, for example, is REST only.

The left column is REST. It is calendar-versioned, and you pick the version with the X-GitHub-Api-Version header. 2026-03-10 is the newest version and the first with breaking changes. 2022-11-28 is still the default when you omit the header, and it stays supported for at least twenty-four months. So nothing broke on March 12 when the new version shipped. Things break when a script omits the header and the default moves. Put the header in every script.

The right column is GraphQL. One POST to slash graphql with a query or a mutation. You ask for nested data and get back only the fields you named. Two dated changes. Since September 1, 2025, GitHub caps execution resources per query, so a query that walks every repository and every collaborator is rejected rather than slow. And the GraphQL Explorer inside the docs was removed on November 7, 2025. Use gh api graphql, which is what Lab 13 does.

The table at the bottom is the rate limits, one number per credential. A personal access token, or an OAuth token, gets five thousand requests an hour per user. A GitHub App installation token gets fifteen thousand an hour on GitHub Enterprise Cloud. GITHUB_TOKEN in a workflow gets one thousand an hour per repository, or fifteen thousand against Enterprise Cloud resources. Handle the rate-limit response in every script; the reference card has the one-liner that shows what you have left.

> The credential decides the limit. So let us read the credentials.

SOURCE: https://docs.github.com/en/rest/about-the-rest-api/api-versions
https://github.blog/changelog/2026-03-12-rest-api-version-2026-03-10-is-now-available
https://github.blog/changelog/2025-09-01-graphql-api-resource-limits
https://github.blog/changelog/2025-11-07-graphql-explorer-removal-from-api-documentation-on-november-7-2025
https://docs.github.com/en/enterprise-cloud@latest/rest/using-the-rest-api/rate-limits-for-the-rest-api
https://github.com/octokit/octokit.js

## [credentials] Credentials: read the prefix

SHOW: Four cards, one per credential type, with the token prefix on the first line of each.

The prefix tells you what you are looking at, so let us read the cards left to right.

Personal access tokens. github underscore pat underscore for fine-grained, ghp underscore for classic. They are for personal use: scripts, local debugging, one-off calls. Never for a service the company depends on, because the token leaves with the person. Prefer fine-grained. Enterprise policy can restrict classic tokens, require approval for fine-grained ones, and cap the lifetime; the default maximum for fine-grained tokens is 366 days. Tokens unused for a year are revoked automatically.

OAuth Apps, gho underscore. They act as the user who authorized them and share that user's five thousand an hour. They remain for identity-provider style sign-in and the few things a GitHub App cannot do. Since August 14, OAuth apps can issue eight-hour access tokens with six-month refresh tokens; on by default for new apps, opt-in for existing ones. GitHub's own docs say it: in general, GitHub Apps are preferred over OAuth apps.

GitHub Apps, the green card, and the recommended choice. Three prefixes. ghu underscore is a user access token, eight hours. ghr underscore is its refresh token, six months. ghs underscore is an installation token: one hour, its own identity, fine-grained permissions, no license consumed, fifteen thousand requests an hour on Enterprise Cloud. One change to know. Installation tokens are now stateless JWTs of about five hundred twenty characters, and the rollout finished on October 2. If an integration checked token length, or stored tokens in a forty-character column, it is already broken. Treat tokens as opaque strings.

GITHUB_TOKEN, also ghs underscore, because it is an installation token too. GitHub mints one per job, it expires when the job ends, and events it causes do not start new workflow runs. Inside Actions, use it first.

The purple callout covers the rest. Deploy keys are SSH keys scoped to one repository, read-only unless someone ticks write access, and they do not go through SSO. Machine users are ordinary accounts owned by nobody; keep their credentials in a shared secret store. Both are hit by the SSH hardening. New RSA keys must be at least 3072 bits since October 14. ssh-rsa SHA-1 signatures get brownouts on November 4 and December 9 and are removed on January 13. Ed25519 keys are unaffected, so that is the guidance to send out. And the temporary stateless-token header is deprecated on November 30.

CHECK: The X-GitHub-Stateless-S2S-Token header deprecation on 2026-11-30 and the SSH brownouts are announced, not yet past. Confirm before delivery.

> You know the four credentials. The next slide decides between them.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-programmatic-access-to-your-organization/github-credential-types
https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise
https://docs.github.com/en/enterprise-cloud@latest/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation
https://github.blog/changelog/2026-08-14-multiple-redirect-uris-and-token-refresh-for-oauth-apps
https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app
https://github.blog/changelog/2026-10-02-stateless-github-app-installation-tokens-rolled-out
https://docs.github.com/en/enterprise-cloud@latest/rest/using-the-rest-api/rate-limits-for-the-rest-api
https://docs.github.com/en/actions/concepts/security/github_token
https://docs.github.com/en/enterprise-cloud@latest/authentication/connecting-to-github-with-ssh/managing-deploy-keys#machine-users
https://github.blog/changelog/2026-09-22-security-improvements-for-ssh

## [auth-decision] Which access method?

SHOW: The interactive decision tree. Each answer adds a step to the path on the right.

DO: Walk two paths live: the personal script, then the bot.

Four questions, and the tree gives you the answer with the reason.

CLICK: Start over, so the first question is on screen.

First question: will this run only as you, on your own machine? Take the personal script case.

CLICK: Yes.

Is it simple and short-lived? A few calls, no service, no shared credential.

CLICK: Yes.

Fine-grained personal access token. Scope it to the repositories and permissions it needs, set an expiry, authorize it for your SSO organizations. And never hand it to a service.

CLICK: Start over. Now the bot.

Will it run only as you? No, it runs on a server.

CLICK: No.

Does it need to act as its own identity, not as a person? Bots, CI, anything that outlives one employee.

CLICK: Yes.

GitHub App with an installation token. Fine-grained permissions, no license, fifteen thousand an hour, short-lived tokens. Inside Actions, prefer GITHUB_TOKEN when the workflow's own repository is enough.

The two paths we did not click. No on own identity, then Yes on acting for a signed-in user, gives a GitHub App user token: the ghu underscore flow with eight-hour tokens. No on both gives an OAuth App, and that is the only branch that lands there.

So the sentence to remember: when in doubt, a GitHub App. Lab 11, self-paced, installs one and reviews its permissions as an administrator.

> Time to call the API yourselves. Lab 5.

SOURCE: https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app
https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app
https://docs.github.com/en/actions/tutorials/authenticate-with-github_token

## [lab05] Lab 5 · GitHub API with REST and GraphQL

LAB: Fifteen minutes. Share the lab link in chat.

Lab 5, fifteen minutes, labs slash lab05.

You will edit the workflow use-github-apis.yml in your repository. In 5.1 you extend the REST job so it creates an issue and then closes it, using actions/github-script, which hands you an authenticated Octokit client on the workflow's GITHUB_TOKEN. No personal token anywhere. In 5.2 you add a GraphQL job that fetches the repository's labels and their issues in a single query. Commit to main, then watch both jobs in the Actions tab.

Done when the REST job created and closed an issue, the GraphQL job printed the labels, and both jobs are green.

If a run fails on permissions, the workflow declares issues write explicitly; check that you kept that block. And if ubuntu-latest behaves oddly this month, it is mid-migration to 26.04: pin ubuntu-24.04 and compare.

DEMO: Open the workflow file on screen and paste the first snippet, so everyone sees where it goes.

TIME: Call two minutes before the end.

> Back from the lab: Actions, which you have just been using.
