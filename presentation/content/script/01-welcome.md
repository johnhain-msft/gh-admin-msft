# Script · Welcome

## [cover] Title

SHOW: Title slide with the five themes: Enterprise, Security, Productivity, Collaboration, AI.

Good morning, everyone, and welcome. Thank you for making the time for two mornings of this.

DO: Start the recording. Confirm chat is visible and the participant list is open.

DO: If the pre-scoping questionnaire came back, keep it next to you: you will tailor examples to it in the next ten minutes.

> Let me tell you how these two days work.

## [welcome] Two days, one goal

The goal is one sentence, and it is on the screen. Run a GitHub Enterprise Cloud environment that is secure, governed, and still fast to work in. Every topic today serves that sentence.

Who is here. Enterprise owners, organization owners, repository administrators. You already use GitHub every day. So I will not explain what a pull request is. I will explain what happens when three rulesets apply to the same one.

How we work. Each block is a short presentation, usually under twenty minutes, and then a lab. You do the labs in the workshop organization, on your own account. Ask in chat whenever you want. I read chat at every slide break, and if something is urgent, unmute.

What you leave with. The repository you have access to holds every lab, thirty reference documents, and a reference card. On Day 2 you will write your own thirty-day action plan, and I will hold you to it.

ASK: Quick round of introductions: your name, your role, and the one thing you want sorted by Thursday. Chat is fine if the group is large.

PAUSE: Three to four minutes. Note the roles: it tells you which labs need the organization-owner path.

> Here is what you will be able to do when we are done.

## [objectives] What you will be able to do

These are the objectives we will hold ourselves to. I will read the two that people usually underestimate.

Day 1, the permission flow. Most access problems I get called into are not bugs. They are a base permission, a team role and a repository ruleset interacting exactly as designed. By mid-morning you will be able to read that flow top to bottom.

Day 2, credentials. Choosing between a personal token, an OAuth app, a GitHub App and the workflow token is the single most common security decision your developers make, and most of them make it by habit. You will have a decision tree for it.

If you are preparing for the GitHub Enterprise Administrator exam, GH-100, note that its skills changed in July 2026. Identity and access is fifteen to twenty percent and now includes enterprise teams. Secure SDLC and compliance is the biggest domain at twenty-five to thirty. Actions is twenty to twenty-five. Each section header today names the domain it serves.

> The shape of the two days looks like this.

SOURCE: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-100

## [agenda] Agenda

Day 1 is the top of the hierarchy: enterprise, then organizations, then the people and teams inside them. Three labs: Copilot governance, teams, and the audit log.

Day 2 goes down to the repository: rulesets, security, the API, and Actions. Six labs. The hands-on time is the most valuable part of both days, so when I am running behind, I trim my talking, not your labs.

Two breaks, one each day, around the ninety-minute mark. The deck has a timed agenda in your own time zone: press A on your copy, or watch for the times I post in chat.

Nine labs are self-paced extensions. You will see them listed at the end of Day 2, and each one has an organization-owner path when it needs enterprise access.

> Before any content, let us make sure your tools work.

## [setup] Environment check

Three commands. Run them now, in your own terminal.

gh version, to confirm the GitHub CLI is installed. gh auth status, to confirm you are logged in to github.com on the right account, with admin colon org, repo and workflow scopes. And git version.

While those run, write down two things. The workshop organization name, which I am posting in chat now. Every lab calls it YOUR-ORG. And your GitHub handle: the labs prefix shared objects with it, so two of you creating a ruleset at the same time do not collide.

DO: Post the organization name and the repository link in chat.

One more thing to know about yourself. Are you an organization owner, or also an enterprise owner? Several labs have a collapsible path for each. Enterprise-only steps, like enterprise teams and managed settings, are marked. Nobody needs enterprise access to finish the timed labs.

PAUSE: Give the room two to three minutes. Watch chat for "gh not found" and proxy errors.

If something fails, the setup guide in the repository has the troubleshooting table. Keep working on it through the first block. The first lab is an hour away.

> Let us start at the top: the platforms GitHub Enterprise runs on.
