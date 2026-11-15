# dev-packages — Internal Tooling

Private packages powering the monorepo build, lint, test, and visual-diff infrastructure. Not published to npm.

## PACKAGES

| Package                                     | Purpose                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| `eslint-config-lumapps`                     | Shared ESLint config extended by all packages                  |
| `eslint-plugin-lumapps`                     | Custom ESLint rules specific to LumX conventions               |
| `storybook-testing`                         | Shared Storybook test utilities (`@lumx/storybook-testing`)    |
| `visual-diffs`                              | Playwright-based visual regression tool (`@lumx/visual-diffs`) |
| `base-vite-lib-config`                      | Shared Vite config (and its plugins) to build the LumX libs    |
| `docgen`                                    | React/Vue docgen (`@lumx/docgen`) powering the site-demo prop-table Gatsby plugin |

## WHERE TO LOOK

| Task                         | Location                                     |
| ---------------------------- | -------------------------------------------- |
| Add/edit ESLint rule         | `eslint-plugin-lumapps/`                     |
| Change shared linting config | `eslint-config-lumapps/`                     |
| Fix visual-diff tooling      | `visual-diffs/`                              |
| Fix Storybook test utilities | `storybook-testing/`                         |
| Change the lib build config  | `base-vite-lib-config/index.ts`              |
| Fix ESM import issues        | `base-vite-lib-config/plugins/`              |
| Fix icon import optimization | `base-vite-lib-config/plugins/`              |
| Fix React/Vue prop-table docgen | `docgen/`                                |

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
-   Lib build plugins only affect the build output — not runtime behavior
