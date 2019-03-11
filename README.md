# LumApps Design System (LumX)

The first official LumApps Design System for [AngularJS][angularjs] or [ReactJS][reactjs] applications.
_LumX_ will help you design your applications faster and more easily. You will be able to use LumX with either the LumApps design styleguides or the [Google Material Design specifications][material].

## Quick start

To start to use LumX, you can either:

-   Install with Yarn/NPM:

```bash
yarn add @lumx/<angularjs|react>
# Or
npm install @lumx/<angularjs|react>
```

-   Download the latest release for [AngularJS][angularjs-release] or [ReactJS][reactjs-release]
-   Clone the repository: `git clone https://github.com/lumapps/design-system.git`

You can then use the UMD, AMD or CommonJS bundle that suits your taste.
See [examples](./dist/examples) for more information on how to use each bundle.

## Documentation

LumX's documentation is included in the "demo" directory. The demo/documentation site is built with [Webpack][webpack] and may be run locally.
You can also find an online version of the demo and documentation site at https://design-system.lumapps.com.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md).

## Project installation

[Yarn dependency manager](https://yarnpkg.com/) is recommended to launch the project. Check out the [official installation documentation](https://yarnpkg.com/en/docs/install) if not installed.
You will need Yarn to execute the automatic setup script.

### Install project dependencies

> Note that `@mdi/js` is defined as `devDependencies`. This is a way to make dev server usage easier because [`@lumx/icons`](./src/icons) needs it.

For an automatic installation:

```bash
yarn setup
```

Or, if you don't have Yarn or want to manually proceeed to the setup:

```bash
yarn install && cd ./src/icons && yarn install && cd -
# Or
npm install && cd ./src/icons && npm install && cd -
```

### To start development server

For AngularJS development server:

```bash
yarn start:angularjs
# Or
npm run start:angularjs
```

For ReactJS development server:

```bash
yarn start:react
# Or
npm run start:react
```

You can then open your browser to [http://localhost:4000/](http://localhost:4000/) to access the demo and test site.

## Project build

you can build LumX by using:

```bash
yarn build[:<all|react[:<commonjs>]|angularjs]
# Or
npm run build:<react:commonjs|angularjs>
```

This will produce the target build for either AngularJS or ReactJS.

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).

[angularjs]: https://angularjs.org/
[reactjs]: https://reactjs.org/
[local]: http://localhost:8888
[material]: http://www.google.com/design/spec/material-design/introduction.html
[angularjs-release]: https://www.npmjs.com/package/@lumx/angularjs
[reactjs-release]: https://www.npmjs.com/package/@lumx/react
[webpack]: https://webpack.js.org/
