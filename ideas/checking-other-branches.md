# Checking another branch safely

Advice, 2026-11-14. Current branch at inspection: `cli-prototype`, with modified and untracked files. Remote branch `origin/new-ui` exists.

Options:
- GitHub branch selector: inspect committed files online; cannot run them locally.
- Separate Git worktree (recommended for local testing): keeps current folder and uncommitted files in place; uses another folder.
- Commit or stash (including untracked files) then switch: uses one folder but interrupts ongoing work.

For a temporary inspection of new-ui, run from the repository:

```sh
git fetch origin
git worktree add --detach ../NASA2026-Flux-new-ui origin/new-ui
```

Open the new folder separately. Detached mode is for inspection/testing; create a branch there before making work you intend to keep. Current uncommitted files are not copied into that folder. No worktree or branch switch was performed while giving this advice.

Source: https://git-scm.com/docs/git-worktree
