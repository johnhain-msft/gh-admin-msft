# Hands-on Labs Setup
In this lab you will create your own admin repository from the workshop repository, either from the template or from a clone
> Duration: 5 minutes

References:
- [Creating a repository from a template](https://docs.github.com/en/enterprise-cloud@latest/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
- [Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
- [gh repo create](https://cli.github.com/manual/gh_repo_create)

## 1. Create your repository from the template

1. Navigate to the main page of the workshop repository [gh-admin-msft](https://github.com/johnhain-msft/gh-admin-msft)
2. Click `Use this template`, then `Create a new repository`
3. Set the **Owner** to your workshop organization (`YOUR-ORG`, noted in section 3)
4. Name the repository `gh-admin-msft-[USERNAME]`, replacing `[USERNAME]` with your GitHub username
5. Keep the visibility **Private** and click `Create repository`
6. Open `YOUR-ORG/gh-admin-msft-[USERNAME]`. This is "your own repository" in the labs that follow.

> **Note:** The workshop repository is private, so `Use this template` only appears once you can read it. If the button is missing, ask your instructor to confirm that your invitation to the workshop organization was accepted.

## 2. _(Alternative)_ Clone the repository and push it to a new repository

Use this path if you prefer the command line, or if the template button is not available to you.

1. Clone the repository into a folder named after your new repository, and free the `origin` name for the repository you are about to create:

   ```bash
   git clone https://github.com/johnhain-msft/gh-admin-msft.git gh-admin-msft-[USERNAME]
   cd gh-admin-msft-[USERNAME]
   git remote rename origin template
   ```

2. Create `gh-admin-msft-[USERNAME]` in your workshop organization and push the clone to it:

   ```bash
   gh repo create YOUR-ORG/gh-admin-msft-[USERNAME] --private --source=. --remote=origin --push
   ```

3. Open `https://github.com/YOUR-ORG/gh-admin-msft-[USERNAME]` and confirm that the files are there.

## 3. Prerequisites

For full environment prerequisites and instructor setup, see the [Pre-Workshop Checklist](../docs/PRE-WORKSHOP-CHECKLIST.md).

> **📝 Note your workshop organization name:** `___________________________`
> You will use this as `YOUR-ORG` throughout the labs. Your instructor will share the org name during the welcome session.

Minimum requirements:
- GitHub.com account with access to the workshop organization
- Modern web browser (Chrome, Firefox, or Edge)
- [GitHub CLI (`gh`)](https://cli.github.com/) installed
- Git installed and configured with name/email
- Terminal or command-line access

## 4. Verify Your Environment

Run these commands to confirm your tools are ready:

```bash
gh --version
```

Expected output (version may vary):

```
gh version 2.x.x (20xx-xx-xx)
```

> **Note:** Since v2.91.0 (2026-04-22), GitHub CLI sends pseudonymous usage telemetry by default; it doesn't collect it when the target is GitHub Enterprise Server. On managed or shared workshop machines, set `GH_TELEMETRY=false` or `DO_NOT_TRACK=true`, or run `gh config set telemetry disabled` to opt out. Set `GH_TELEMETRY=log` to print what would be sent instead of sending it. Environment variables take precedence over the config value, and extensions handle their own telemetry. See [GitHub CLI telemetry](https://docs.github.com/en/github-cli/github-cli/github-cli-telemetry).

```bash
gh auth status
```

Expected output:

```
github.com
  ✓ Logged in to github.com account YOUR-USERNAME (keyring)
  ✓ Git operations for github.com configured to use https protocol.
  ✓ Token: gho_************************************
  ✓ Token scopes: 'admin:org', 'gist', 'read:enterprise', 'repo', 'workflow'
```

```bash
git --version
```

Expected output:

```
git version 2.x.x
```

## 5. Troubleshooting

| Issue | Solution |
|-------|----------|
| `gh: command not found` | Install the GitHub CLI from [cli.github.com](https://cli.github.com/). On macOS use `brew install gh`, on Windows use `winget install --id GitHub.cli`. |
| `gh auth status` shows not logged in | Run `gh auth login`, select `GitHub.com`, and follow the browser-based authentication prompts. |
| Cannot clone or push to repositories | Verify your organization membership. Contact the instructor to confirm your invitation was accepted. |
| API calls fail or time out behind a corporate network | Check with your IT team whether proxies or firewalls block `github.com` or `api.github.com`. You may need to configure proxy settings: `git config --global http.proxy http://proxy:port`. |

## 6. Network Requirements

> **Note:** This workshop requires unrestricted HTTPS access to `github.com`, `api.github.com`, and `*.githubusercontent.com`. If your organization uses a corporate proxy or firewall, verify these domains are allowed before the workshop. VPN split-tunneling may also need to be configured to allow direct access to GitHub endpoints.
