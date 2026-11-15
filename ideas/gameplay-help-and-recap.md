# Gameplay help and recap layout

Implemented for Bea’s browser-play feedback, 2026-11-15.

## Options and choice
- Expandable rows: compact, but every explanation takes a click.
- Visible sections (selected): easier to scan, at the cost of vertical space. Keep extra Why do it detail expandable.
- Separate tabs: less scrolling, but separates the source from its caveats.

Retain the current console design. Palette: pale paper #FBF9FF, ink #30264E, Curio mint #E9FCF8, teal #35A99B, amber #FFB347, menu #141038. Fredoka remains the UI/body family; Lexend remains for existing small labels. All explanations are left aligned. Scoped styles avoid older story-screen typography and global section margins.

## Layout

    Job: costs → what it does → current state → Curio’s tip → Why do it
    Data: simulation notice → game rules | NASA archives → art credits
    Result: short story → paid time/meter changes → tutorial reason → Got it
    Recap: before/after bars → jobs vs week-end totals → crew work | base events
           → repair/emergency notice → optional full log

Small stages stack the data/story columns and scroll the body. Actions stay visible. Reading sections use headings and a comfortable line height; advice no longer requires hover. Radiation gains are treated as worsening in the recap; high power, air and energy are better.

## Rules and accuracy

Clean now uses the existing paid browser cleaning job, rather than just resetting dust. No changes to job costs or the global time budget. Recap deltas come from snapshots before jobs, before week close, and after week close; no charts invent a time series. Historical measurements remain archive data, and all resource points remain simulated. Legacy engine alert shortcuts remain outside this browser change.

Seven pooled time blocks was recommended as a trial, with balance validation, but is pending Bea’s preference. The existing 8/6/4 energy-based allowance remains.

## Validation

- Build and 12 web tests pass; whitespace check passes.
- New tests cover cleaning charges exactly once, invalid/repeated choices, and job + week-end deltas matching final changes after caps and after saving/reloading.
- Orca browser checked the tutorial flow, result confirmation, end-week type sizes, recap/reload, source guide, and all Curio questions at 1280×720 and 900×506. Long content scrolls; the actions remain visible.
- Not tested with children. Mobile portrait remains the existing landscape stage with horizontal scrolling.
