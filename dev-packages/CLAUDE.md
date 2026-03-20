# dev-packages — Internal Tooling

Private packages powering the monorepo build, lint, test, and visual-diff infrastructure. Not published to npm.

## PACKAGES

| Package                                     | Purpose                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| `eslint-config-lumapps`                     | Shared ESLint config extended by all packages                  |
| `eslint-plugin-lumapps`                     | Custom ESLint rules specific to LumX conventions               |
| `storybook-testing`                         | Shared Storybook test utilities (`@lumx/storybook-testing`)    |
| `visual-diffs`                              | Playwright-based visual regression tool (`@lumx/visual-diffs`) |
| `rollup-plugin-fix-esm-imports`             | Rollup plugin: fixes ESM import paths for downstream compat    |
| `rollup-plugin-optimize-imports-lumx-icons` | Rollup plugin: tree-shakes `@lumx/icons` imports in consumers  |

## WHERE TO LOOK

| Task                         | Location                                     |
| ---------------------------- | -------------------------------------------- |
| Add/edit ESLint rule         | `eslint-plugin-lumapps/`                     |
| Change shared linting config | `eslint-config-lumapps/`                     |
| Fix visual-diff tooling      | `visual-diffs/`                              |
| Fix Storybook test utilities | `storybook-testing/`                         |
| Fix Rollup ESM issues        | `rollup-plugin-fix-esm-imports/`             |
| Fix icon import optimization | `rollup-plugin-optimize-imports-lumx-icons/` |

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

## NOTES

-   All packages here are workspace-internal only (`"private": true`)
-   Consumed via Yarn workspace protocol (`"@lumx/storybook-testing": "workspace:*"`)
-   Changes to ESLint config apply immediately across all packages (no rebuild needed)
-   Rollup plugins only affect the build output — not runtime behavior
