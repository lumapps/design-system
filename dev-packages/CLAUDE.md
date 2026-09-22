# dev-packages — Internal Tooling

Private packages powering the monorepo build, lint, test, and visual-diff infrastructure. Not published to npm.

## PACKAGES

| Package                                     | Purpose                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `eslint-config-lumapps`                     | Shared ESLint config extended by all packages                                     |
| `eslint-plugin-lumapps`                     | Custom ESLint rules specific to LumX conventions                                  |
| `storybook-testing`                         | Shared Storybook test utilities (`@lumx/storybook-testing`)                       |
| `visual-diffs`                              | Playwright-based visual regression tool (`@lumx/visual-diffs`)                    |
| `rollup-plugin-fix-esm-imports`             | Rollup plugin: fixes ESM import paths for downstream compat                       |
| `rollup-plugin-optimize-imports-lumx-icons` | Rollup plugin: tree-shakes `@lumx/icons` imports in consumers                     |
| `docgen`                                    | React/Vue docgen (`@lumx/docgen`) powering the site-demo prop-table Gatsby plugin |
| `lumx-mcp`                                  | MCP server (`@lumx/mcp`) exposing the design system to AI coding assistants       |

## WHERE TO LOOK

| Task                            | Location                                     |
| ------------------------------- | -------------------------------------------- |
| Add/edit ESLint rule            | `eslint-plugin-lumapps/`                     |
| Change shared linting config    | `eslint-config-lumapps/`                     |
| Fix visual-diff tooling         | `visual-diffs/`                              |
| Fix Storybook test utilities    | `storybook-testing/`                         |
| Fix Rollup ESM issues           | `rollup-plugin-fix-esm-imports/`             |
| Fix icon import optimization    | `rollup-plugin-optimize-imports-lumx-icons/` |
| Fix React/Vue prop-table docgen | `docgen/`                                    |
| Fix/extend the MCP server       | `lumx-mcp/`                                  |

## VISUAL DIFFS

`@lumx/visual-diffs` runs Playwright against Storybook static builds and compares screenshots:

-   Baselines stored in `packages/lumx-react/__vis__/` and `packages/lumx-vue/__vis__/`
-   Run with `yarn test:storybook:react` / `yarn test:storybook:vue`
-   CI caches baselines on master; PRs compare against cached baseline
-   `__vis__/local/` — local results (not committed); `__vis__/local/__baselines__/` — accepted baselines

## STORYBOOK TESTING

`@lumx/storybook-testing` provides:

-   Playwright helpers for story-based visual testing
-   Story interaction test utilities
-   Shared setup for both React and Vue Storybook environments

## MCP SERVER

`@lumx/mcp` serves the design system to an MCP client (Claude Code, Claude Desktop) so a product
repository can look up components without the design system checked out:

-   Serves a prebuilt `data/index.json` — no compiler or build step at runtime
-   Regenerate with `yarn workspace @lumx/mcp generate` (run it on every release)
-   Detects the consuming project's framework and serves only React **or** Vue components;
    override with `LUMX_FRAMEWORK=react|vue|all`
-   `data/migrations.json` is the only hand-maintained file (legacy `bkpr-*` tag mappings);
    the generator fails on a target that is not a real component
-   Full docs, tool list and install steps: `lumx-mcp/README.md`

## NOTES

-   All packages here are workspace-internal only (`"private": true`)
-   Consumed via Yarn workspace protocol (`"@lumx/storybook-testing": "workspace:*"`)
-   Changes to ESLint config apply immediately across all packages (no rebuild needed)
-   Rollup plugins only affect the build output — not runtime behavior
