# Script · Audit log and dormant users

## [audit-overview] The audit log

Last presentation block of the day: the audit log, and the users who have stopped using their license.

The audit log captures settings changes, membership changes, repository actions, app permissions, authentication events, billing events, and Git events. The enterprise audit log aggregates every organization, which is one of the quiet benefits of having an enterprise account.

Retention is the detail that matters. Web events are kept for one hundred eighty days, in the UI and the API. Git events, clone, push and fetch, are kept for seven days, and only through the API. I will say that again, because it ends investigations: Git events last seven days.

IP addresses appear only if an enterprise owner has enabled IP disclosure. And since this year every entry carries actor is agent, with agent session task events for agent runs, so you can tell what an agent did and on whose behalf.

Searching. The qualifiers are action, actor, created, repo, operation and country, and they AND together. The right column has the four queries you will use most: who created repositories, who changed a base permission, every ruleset and branch protection change, and enterprise team changes. You can export CSV or JSON. The API paginates with a cursor and allows seventeen hundred fifty requests an hour.

> One hundred eighty days is not a compliance window. Streaming is.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/about-the-audit-log-for-your-enterprise
https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/using-the-audit-log-api-for-your-enterprise
https://github.blog/changelog/2026-02-26-enterprise-ai-controls-agent-control-plane-now-generally-available

## [audit-streaming] Streaming to your SIEM

Audit log streaming is an enterprise feature that forwards events in near real time. The targets are Splunk, Azure Event Hubs, which is how you reach Microsoft Sentinel, Azure Blob Storage, Amazon S3, Google Cloud Storage and Datadog. You can stream to two endpoints at once. There is no generic HTTPS target.

The guarantees. Delivery is at-least-once, so your consumer must tolerate duplicates. Payloads are compressed JSON. If a stream is paused, events buffer for seven days and then drop. GitHub health-checks the stream every twenty-four hours, and a misconfigured stream is disabled after six days. Put that in your runbook: a stream that breaks on a Friday needs attention by Thursday.

If you do not have enterprise streaming, there is a workaround. A scheduled workflow that calls the organization audit-log API daily and archives the output to your own storage. Lab 8 builds the exact command.

Why it is not optional: SOC 2, FedRAMP and HIPAA retention requirements exceed one hundred eighty days, and real-time alerting on a new owner or a ruleset bypass only happens in a SIEM.

ASK: Who is streaming today, and to what? If nobody is, which SIEM would it be?

> The audit log also tells you who has stopped showing up.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise

## [dormant-users] Dormant users

A user is dormant after thirty days without qualifying activity. The window is fixed.

What counts: signing in through SAML or the web, creating a repository, pushing to an internal repository over HTTPS, and the collaboration actions: issues, pull requests, comments, labels, releases, stars, wiki pushes.

What does not count, and this is the list that matters. Anything done with a personal access token, an SSH key or a GitHub App. Git operations on private repositories. Browsing without interacting. And public activity outside the enterprise.

So a developer who pushes to private repositories over SSH every single day can appear dormant. And a CI service account always will.

The reports are under Enterprise, People, Dormant users, and under Compliance, Reports, as a CSV. The process that works: report monthly, exclude service accounts and bots, warn the person, give a grace period of a week or two, then remove. Lab 10, self-paced, scripts the organization-level version and designs the reclamation workflow.

> Let us get your hands on the audit log. Lab 8.

SOURCE: https://docs.github.com/en/enterprise-cloud@latest/admin/managing-accounts-and-repositories/managing-users-in-your-enterprise/managing-dormant-users

## [lab08] Lab 8 · Audit log exploration

LAB: Twenty minutes. Share the lab link in chat.

Lab 8, twenty minutes, labs slash lab08.

You will filter the organization audit log in the UI with action, actor and created. You will query it with gh api, including Git events and cursor pagination. You will read a repo create payload field by field. And you will write the daily export command that stands in for streaming.

Done when the verification command prints "Audit log API access confirmed", you can say the retention windows without looking, and you have picked a streaming target for your own SIEM.

Enterprise owners: the collapsible sections cover the enterprise audit log and the streaming setup screen.

DEMO: Run the first gh api query on screen so everyone sees the shape of a payload.

TIME: Call two minutes before the end.

> Before we close, two questions to check what stuck.

## [day1-quiz] Knowledge check

ASK: Read the first question aloud. Give the room thirty seconds, take answers in chat, then click the option the majority chose.

First question. An enterprise policy enforces private and internal only, and an organization owner creates a public repository. What happens?

PAUSE: Thirty seconds.

CLICK: The majority's answer, then B if they missed it.

B. Enforced policies cannot be weakened one level down. That is the whole cascade in one sentence.

ASK: Second question, same routine.

Your SRE group reviews pull requests in twelve organizations and gets Copilot Business from the enterprise. Membership lives in Entra ID. What do you set up?

PAUSE: Thirty seconds.

CLICK: The majority's answer, then B.

B. One enterprise team, synced from the Entra ID group, assigned to all twelve organizations. It carries the review requests and the Copilot licenses. Lab 16 plans one.

> Four sentences to take home.

## [day1-wrap] Day 1 in four sentences

Policies cascade down, and nobody can weaken them from below. Visibility plus base permission decides who sees a repository, and roles decide what they do in it. Defaults are on now: models since August 26, Copilot features since October 22, so configure what you mean. And teams carry access, which means the identity provider should carry the teams.

Tomorrow we go down to the repository: rulesets, security scanning, the API, and Actions, with six labs. Same time, same link. The three self-paced labs for today's topics, 10, 16 and 17, are in the repository if you want a head start.

ASK: One thing you learned today that you will change next week. Chat or unmute.

PAUSE: Take two or three answers.

Thank you. See you tomorrow.

DO: Stop the recording. Post the Day 2 join link and the reference card in chat.
