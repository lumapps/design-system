# LumApps Design System (LumX)

The first official LumApps Design System for [React][react] applications.
_LumX_ will help you design your applications faster and more easily. You will be able to use LumX with either the LumApps design styleguides or the [Google Material Design specifications][material].

## Quick start

```bash
yarn add @lumx/<icons|react>
# Or
npm install @lumx/<icons|react>
```

## Documentation

LumX's documentation is included in the "demo" directory. The demo/documentation site is built with [Webpack][webpack] and may be run locally.
You can also find an online version of the demo and documentation site at https://design.lumapps.com.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md).

## Project installation

[Yarn dependency manager](https://yarnpkg.com/) is recommended to launch the project. Check out the [official installation documentation](https://yarnpkg.com/en/docs/install) if not installed.
You will need Yarn to execute the automatic setup script as well as for publishing the package.

### Install project dependencies

For an automatic installation:

```bash
yarn install
```

### Git hooks

Git hooks are optional, they provide lint and commit message validation on commit if you install them with the command:

```bash
yarn setup:git-hooks
```

You can uninstall the git hooks using `yarn clean:git-hooks`.

### To start development server

For development server:

```bash
yarn start
```

You can then open your browser to [http://localhost:4000/](http://localhost:4000/) to access the demo and test site.

You can also execute a Storybook to develop your components, in order to that you just need to execute:

```bash
yarn storybook:react
```

**Note**: storybook is currently configured for React components.

## Project build

you can build LumX by using:

```bash
yarn build
```

This will produce the target build for `@lumx/core`, `@lumx/icons`, `@lumx/react` and the demo site.

## How to publish packages

**The full release process is automated in a GitHub workflow** which can be triggered on the [release.yml](https://github.com/lumapps/design-system/actions/workflows/release.yml) page with the "Run workflow" button.

Three parameters are available:

1. The base branch used for the release. Tags cannot be used and only the `master` branch is authorised when releasing a "patch", "minor" or "major" version.
2. The release type
    - "patch", "minor" & "major" will release a version increment `vX.Y.Z`
    - "prerelease" will release increment the last prerelease version if it exists (ex: `3.0.1-alpha.0` => `3.0.1-alpha.1`) or will increment the last patch version and append the release name (ex: `3.0.2` => `3.0.3-alpha.0`)
3. (Optional) The prerelease name (if applicable).

Releasing a new version of the lumx packages consists in:

1. Incrementing the version number (patch, minor, major or prerelease)
2. Building all lumx packages (`yarn build` for all packages)
3. Pushing on NPM (`npm publish` for all packages)
4. (if not a prerelease) Pushing updated version on GitHub (new tag & new pull request)

**Prereleases** are used to test the lumx libs before committing to a release. They are never merged in master and never mentioned in the CHANGELOG.md file. By default, prereleases use the tag `alpha` (ex: `3.0.1-alpha.0` aliased to `alpha` on NPM) but this can be changed to test multiple and unrelated versions (ex: `alpha-fix-thumbnail`, `alpha-refactor-types`, etc.).

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).

[react]: https://react.org/
[material]: http://www.google.com/design/spec/material-design/introduction.html
[react-release]: https://www.npmjs.com/package/@lumx/react
[webpack]: https://webpack.js.org/
