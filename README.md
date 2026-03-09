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

The release process uses two automated GitHub workflows:

### Official releases (patch / minor / major)

1. Manually trigger [**CD / Prepare Release**](https://github.com/lumapps/design-system/actions/workflows/cd-prepare-release.yml) with `releaseType` (patch, minor, or major) → bumps all package versions, builds libs, and opens a release PR against `master`
2. Review and merge the PR → automatically triggers [**CD / Publish**](https://github.com/lumapps/design-system/actions/workflows/cd-publish.yml), which: builds and publishes all packages to NPM, creates a Git tag, deploys the demo site, and generates GitHub release notes

### Prereleases

Manually trigger [**CD / Publish**](https://github.com/lumapps/design-system/actions/workflows/cd-publish.yml) directly with a `prereleaseName` (default: `alpha`). This bumps to a prerelease version (e.g. `4.6.1-alpha.0`), publishes under that dist tag, and deprecates the previous prerelease. Prereleases are never merged to `master` and never appear in `CHANGELOG.md`.

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).
