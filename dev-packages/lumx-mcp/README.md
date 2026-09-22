# @lumx/mcp

An [MCP](https://modelcontextprotocol.io) server that gives an AI coding assistant (Claude Code,
Claude Desktop, or any other MCP client) accurate, first-hand knowledge of the LumX design system.

Point a product repository at it and the assistant can answer "what props does `IconButton` take",
"which icon is the phone one", "what replaces `bkpr-clickable-icon`" and "which token is the dark
text colour" without guessing, without browsing design.lumapps.com, and without the design system
being checked out next to it.

---

## Why this exists

A consuming project already has `@lumx/react` or `@lumx/vue` in `node_modules`, so the obvious
question is what this adds on top.

**The published typings are indirection, not documentation.** `IconButtonProps` resolves to
`Omit<VueToJSXProps<UIProps>, HyphenatedAriaProps> & { … }`, spread across three packages.
Working out that `emphasis` exists means following the chain by hand. This server serves the
resolved, flattened prop list with the JSDoc attached.

**Four things are not in `node_modules` at all:**

| Missing from `node_modules`           | Consequence without this server                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Usage examples                        | Components get rendered with props missing, e.g. a button with no background       |
| Design guidance (the docs site prose) | No idea when to use high vs medium emphasis                                        |
| A searchable icon index               | Raw SVG path data gets inlined instead of `import { mdiPhone } from '@lumx/icons'` |
| The `--lumx-*` CSS custom properties  | Colours and spacing get hardcoded instead of using a token                         |

---

## Installing it in a product repository

The server runs from this repository. Register it once per consuming project:

```bash
cd /path/to/your-project
claude mcp add lumx -- node /absolute/path/to/design-system/dev-packages/lumx-mcp/src/server.js
```

Verify it connected:

```bash
claude mcp list
```

Then just ask for what you need in plain language. The assistant picks the tool:

> Replace this `<button>` + `<bkpr-icon>` with the LumX equivalent.

> What props does the Vue `Dialog` take?

> Which token should I use for the muted text colour?

### Framework detection

The server serves **only the framework the consuming project uses**, so a Vue project never sees
React components and vice versa. On startup it reads the nearest `package.json` from its working
directory and looks for:

1. `@lumx/vue` or `@lumx/react` in any dependency field
2. failing that, `vue` or `react`
3. failing that, or when both are present, it serves everything

Override it with the `LUMX_FRAMEWORK` environment variable, set to `react`, `vue` or `all`:

```bash
claude mcp add lumx --env LUMX_FRAMEWORK=vue -- node /path/to/design-system/dev-packages/lumx-mcp/src/server.js
```

The detected framework is logged to stderr when the server starts, and every tool description
states which framework it is serving.

---

## Tools

| Tool                     | Returns                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `list_components`        | Every component and the frameworks it supports                                       |
| `get_component_props`    | Full prop API: types, defaults, required flags, JSDoc descriptions, deprecations     |
| `get_component_examples` | The canonical runnable examples from the documentation site                          |
| `get_component_docs`     | The authored usage guidance, as prose with the demo scaffolding stripped             |
| `search_design_tokens`   | `--lumx-*` CSS custom properties with `var()` chains resolved, and the source tokens |
| `search_icons`           | `@lumx/icons` exports matched by meaning, e.g. `phone` finds `mdiPhone`              |
| `find_lumx_replacement`  | Which LumX component replaces a legacy `bkpr-*` or `lx-*` tag                        |

A worked example of the last one:

```
find_lumx_replacement({ tag: "bkpr-clickable-icon" })

{
  "from": "bkpr-clickable-icon",
  "to": "IconButton",
  "confidence": "confirmed",
  "note": "Replaces a `<button>` wrapping an icon. `label` is required (it also becomes the
           tooltip). Always pass `emphasis` and `theme`, otherwise the button renders with
           no background."
}
```

---

## How the data is built

Everything is served from a prebuilt `data/index.json`, so the server needs no design-system
sources, no TypeScript compiler and no build step at runtime. Regenerate it from this repository
after `yarn install`:

```bash
yarn workspace @lumx/mcp generate
```

The generator collects, in one pass:

| Source                                                            | Becomes                 |
| ----------------------------------------------------------------- | ----------------------- |
| `packages/lumx-{react,vue}/src/components/**`, via `@lumx/docgen` | component prop APIs     |
| `packages/site-demo/content/product/**/{react,vue}/*`             | usage examples          |
| `packages/site-demo/content/product/**/*.mdx`                     | design guidance         |
| `packages/lumx-core/src/css/design-tokens.css`                    | CSS custom properties   |
| `packages/lumx-core/style-dictionary/properties/**`               | source design tokens    |
| `packages/lumx-icons/dist/index.d.ts`                             | icon names              |
| `data/migrations.json`                                            | legacy tag replacements |

`data/index.json` is generated and git-ignored. Run the generator on every release so the served
data matches the published packages.

Icons require `@lumx/icons` to have been built (`yarn build:icons`, which `postinstall` does for
you). The generator warns and skips them if the build output is missing.

---

## The one hand-maintained file

`data/migrations.json` maps legacy Beekeeper (`bkpr-*`) tags to their LumX replacements. It is the
only file here that a human writes, because nothing in either codebase records the mapping.

To add an entry, append to `migrations`:

```json
{
    "from": "bkpr-something",
    "to": "SomeComponent",
    "confidence": "suggested",
    "note": "Anything a reader needs to get the replacement right."
}
```

-   `confidence: "confirmed"` — the replacement has been used in a real migration.
-   `confidence: "suggested"` — the mapping is plausible but still needs a human to check the details.
-   `to: null` with `confidence: "none"` — there is no LumX equivalent; say so rather than leaving a gap.

The generator validates every `to` against the parsed component list and **fails the build** on an
unknown name, so the map cannot rot silently as components are renamed. The kebab-case `lx-*`
aliases are derived automatically from the component list and do not belong in this file.

---

## Publishing

The package is currently `"private": true` and runs from a local path. To publish it as
`@lumx/mcp` so consumers can run `npx -y @lumx/mcp`:

1. Drop `"private": true` from `package.json`.
2. Add `"prepublishOnly": "node scripts/generate.js"` so the data is always rebuilt before publish.
3. Release it alongside the other packages, which share a version number.

Consumers then register it with no path:

```bash
claude mcp add lumx -- npx -y @lumx/mcp
```
