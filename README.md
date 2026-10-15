# SFL Calculator — local reconstruction

This is a browser-only reconstruction based on REA observations of the public English site. It includes the landing page, all 35 observed navigation routes, and interactive local previews of the dashboard, farming, animal, cooking, coin conversion, Chapter Race, skills, and PRNG screens. The other route screens reproduce the first-view controls and content captured by REA, while leaving unobserved game formulas and live data clearly unavailable.

The REA evidence was captured on 2026-10-15 and is kept outside this checkout under `%TEMP%`:

- Browser scenario: `ev_ed9440c820f2b9afd5e90aad7fdc519c490c4b31cb5c1e37ba4675f430f0d65d`
- Navigation menus: `ev_d8051f3e7272ac37fd5974862d7d02d26edf33d4e5d43d4125fd8488c77c560f`
- Public tool pages: `ev_6fc936977c317acbaa5141374de4ceadd781352814828ff1ee16244775a988c6`
- Additional page groups: `ev_60469ba73f1a6e65517aee47c41037df427cd1e2ef40c822e1b605abfbfd33e5`, `ev_7e2fae27f21488f9850e65dac29f86f8e9d6bc5ba38c42e10d3cc18cf18f6c1d`, `ev_6468b50f010c8687803274557d63166cc5237d65a056fe3ce5ce16e30cf01e35`
- Static JavaScript analysis: `ev_caa487c17db77a3bea199cc40b15eb334905ecac993b694f2e1427bf966f367e`

The REA menu captures listed 35 calculator and tool routes across Production, Food & XP, Progression, and Tools. Representative calculator screens use editable illustrative inputs. Other pages show the captured first viewport and historical labels, without claiming their full game-specific calculations. The app does not connect to Sunflower Land, fetch market data, store a Farm ID, or predict game outcomes. No wallet connection or transaction is involved.

## Open locally

Run the dependency-free local server from this folder:

```powershell
node serve.mjs
```

Then visit `http://localhost:4173`. You can also open `index.html` directly.
