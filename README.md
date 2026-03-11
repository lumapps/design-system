# LumApps Design System (LumX)

The first official LumApps Design System for React and Vue.js applications.
_LumX_ will help you design your applications faster and more easily.

The demo/documentation site at https://design.lumapps.com

## Quick start

```bash
yarn add @lumx/<icons|react|vue>
# Or
npm install @lumx/<icons|react|vue>
```

## Development

```bash
yarn install           # install dependencies

yarn start             # demo site at http://localhost:4000
yarn storybook:react   # React Storybook at http://localhost:9000
yarn storybook:vue     # Vue Storybook at http://localhost:9001

yarn test              # run all unit tests
yarn test:storybook    # run all storybook integration tests
```

## Project build

You can build LumX by using:

```bash
yarn build:libs   # @lumx/core, @lumx/icons, @lumx/react, @lumx/vue
yarn build:site   # documentation site
```

Each package can also be built individually: `yarn build:react`, `yarn build:vue`, `yarn build:core`, `yarn build:icons`.

## How to publish packages

Everything is handled by the [**CD / Publish**](https://github.com/lumapps/design-system/actions/workflows/cd-publish.yml) workflow.

### Official releases (patch / minor / major)

When a PR modifying lib packages (`packages/lumx-*`) is merged into `master`, the workflow automatically:

1. Publishes a `next` prerelease to NPM (e.g. `4.7.1-next.0`)
2. Creates or updates a **draft** `release/next` PR with the next release version (auto-detected from `CHANGELOG.md`)

To publish an official release:

1. Mark the draft `release/next` PR as **ready for review** (this freezes it — new merges to master won't update it)
2. Review and merge → publishes all packages to NPM, creates a Git tag, deploys the demo site, and generates GitHub release notes

### Prereleases

**Automatic (`next`)**: Triggered on every merge to `master` that modifies lib packages. Release type (patch/minor/major) is auto-detected from `CHANGELOG.md`.

**Manual**: Trigger [**CD / Publish**](https://github.com/lumapps/design-system/actions/workflows/cd-publish.yml) via `workflow_dispatch` with a `prereleaseName` (default: `alpha`). This bumps to a prerelease version (e.g. `4.6.1-alpha.0`) and publishes under that dist tag.

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).
