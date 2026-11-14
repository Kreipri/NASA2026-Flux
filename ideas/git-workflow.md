# Proposed Git workflow

Status: proposed, not configured. 2026-11-14.

Options:
- Direct to main: fastest, but unfinished changes can disrupt the demo.
- Short task branches + pull requests (recommended): keeps main usable with little overhead.
- Main + develop + feature branches: more release control, but unnecessary merging for this prototype.

Recommended practice:
- Keep main runnable. Branch from current main for each small, coherent task, such as feat/source-badges, fix/oxygen-drain, or docs/dataset-notes.
- Commit and push work regularly, including unfinished work on its task branch. Open a draft PR for work in progress.
- Merge when the scoped change works, relevant checks pass, and the diff has been reviewed. Split large features into working increments.
- Squash merge and delete merged task branches. Create the next branch from updated main.
- Start with PRs and relevant automated checks. Require another person's approval only when a human teammate can provide it.
- Agents use task branches and the user's Git identity; no agent collaborators or co-author trailers.
- Concurrent agents must not switch branches in the same directory; use separate workspaces/worktrees if parallel work is requested.

Source: https://docs.github.com/en/get-started/using-github/github-flow
