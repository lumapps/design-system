# LumApps Design System (LumX)

The first official LumApps Design System for [AngularJS][angularjs] or [React][react] applications.
_LumX_ will help you design your applications faster and more easily. You will be able to use LumX with either the LumApps design styleguides or the [Google Material Design specifications][material].

## Quick start

To start to use LumX, you can either:

-   Install with Yarn/NPM:

```bash
yarn add @lumx/<angularjs|react>
# Or
npm install @lumx/<angularjs|react>
```

-   Download the latest release for [AngularJS][angularjs-release] or [React][react-release]
-   Clone the repository: `git clone https://github.com/lumapps/design-system.git`

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

This will produce the target build for `@lumx/core`, `@lumx/angularjs`, `@lumx/react` and the demo site.

## How to publish packages

1. Create a release branch (ex: `release/vX.Y.Z`)
2. Push it to remote (`git push origin release/vX.Y.Z`)
3. Login to NPM with an authorized account: `npm login`
4. Make sure your packages are up to date: `yarn`
5. (Optionnal) Make sure the build doesn't crash: `yarn build`
6. Publish the packages to NPM: `yarn release`
   (you will be asked what version bump to apply)
7. Update the tag `git tag -f vX.Y.Z && git push --tags`
8. Create a PR for the release branch to merge into master

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).

[angularjs]: https://angularjs.org/
[react]: https://react.org/
[material]: http://www.google.com/design/spec/material-design/introduction.html
[angularjs-release]: https://www.npmjs.com/package/@lumx/angularjs
[react-release]: https://www.npmjs.com/package/@lumx/react
[webpack]: https://webpack.js.org/
