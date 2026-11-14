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

## Latest changes: branch recommendation (2026-11-14)

Current branch: `cli-prototype` at `da62739`. Pending changes are UI mockups/assets, screen notes, title drafts, storyline, and decision/handoff updates; no engine changes shown by status. Recommend a new `design/mission-ui` branch from current HEAD so the mockups retain their prototype context. Alternative: continue on `cli-prototype` for convenience, with mixed scope; or use `new-ui` if its separate history is explicitly intended, after comparing and transferring changes carefully. Do not switch this dirty folder to `new-ui` just to publish. Keep main for verified changes. Advice only: no branch created, commit, or push performed.

## Branch cleanup proposal (2026-11-14)

Use main as the integration branch and short-lived task branches. Naming prefixes (feat/, fix/, design/, docs/) describe intent; they are conventions, not permanent categories. Merge completed changes via PR, then delete their branches. Do not keep permanent branches per screen or subsystem.

For this repository: preserve cli-prototype and new-ui until their unique work has been reviewed/integrated. Save current uncommitted UI/story work to design/mission-ui from current HEAD first. This new branch inherits existing prototype commits; it does not automatically separate historical commits by feature. Review cli-prototype into main as the baseline, compare new-ui and integrate its desired changes, then review the design branch. Delete only branches whose desired work has been preserved. The detached new-ui inspection worktree is separate from remote branch cleanup. No branch, commit, push, merge, or deletion performed.

Alternatives: keep current branches temporarily (least disruption, mixed scope); recommended incremental cleanup above (clearer workflow, some review); reconstruct history by feature (cleaner historical split, unnecessary risk/effort now).
