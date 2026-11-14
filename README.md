# Space Base Commander

NASA Space Apps 2026 Junior Astronaut Mission Trainer. Manage a fictional lunar outpost through seven weekly turns, using Power, Air and Radiation plus crew energy. The browser and terminal share the same deterministic TypeScript engine.

## Run locally

Install Node 24 or newer, then:

```sh
npm install
npm run dev
```

Open **http://localhost:5173**. Start with the opening story, or open **http://localhost:5173/?s=week1** to go straight to the playable mission. Keep the terminal running; Ctrl+C stops the server. Source changes rebuild the game; reload the page to see them.

Choose a place, read a job's costs, add jobs to the plan, then review and run the week. Alerts need a choice before the week resolves. The mission saves in this browser. **More → Start a new mission** offers the normal mission and Solar max replay.

For terminal play: `npm run play`. For a different preview port: `npm run dev -- 5180`.

## Build and check

```sh
npm run build
npm run test:web
npm run sim
```

`dist/` is the static website. Serve it over HTTP; opening the HTML directly as a file will not load JavaScript modules. Three.js is pinned to 0.160.0 and copied locally, including its license. Google Fonts is optional and has system fallbacks. Once dependencies are installed, the mission engine, scene modules, art and archived data run without external requests being required.

## Implementation and data

- `src/web/`: browser controller, planning/save adapter, styles and 3D bridge.
- `src/engine/` and `src/config/`: shared mission rules and tunable game values.
- `ideas/ui-mockups/`: the team's original screen/scene prototypes, preserved as design sources.
- `scripts/build-web.ts`: adapts the finished opening flow into the playable build without rewriting its source files.
- `data/samples/README.md`: archived NASA data provenance.

All meters, costs, probabilities and compressed timings are **simulated game values**. The app distinguishes the bundled May 2024 NASA archive from simplified profiles of other historical storms. No live data feed is shown. NASA data does not mean NASA endorsement.

Integration details, verification and remaining data/balance work: [ideas/browser-gameplay-integration.md](ideas/browser-gameplay-integration.md).
