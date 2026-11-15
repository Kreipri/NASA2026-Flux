# Current stack versus React + Vite

Advice requested 2026-11-15. No migration authorized or performed.

| Option | Benefit | Trade-off |
| --- | --- | --- |
| Keep current stack (recommended for finishing this prototype) | Preserves the working game and validated flows | Manual UI rendering and custom build scripts require maintenance |
| Adopt Vite, keep plain JavaScript | Standard dev/build tooling, with a smaller migration scope | Existing HTML generation and asset-copy steps still need adaptation |
| Adopt React + Vite | Components and state-driven rendering could make an expanding UI easier to maintain | Requires porting existing UI/rendering behavior and verifying it again |

The current stack is useful for shipping the existing prototype; it is not inherently superior. React + Vite would be a reasonable choice for a fresh build or continued UI expansion. The shared TypeScript engine and Three.js scene can remain separate from a React UI. No measured performance comparison has been made.

React and Vite are separate choices: Vite supports vanilla JavaScript/TypeScript. React can also be introduced incrementally.

Sources: [Vite guide](https://vite.dev/guide/), [React existing-project guide](https://react.dev/learn/add-react-to-an-existing-project).
