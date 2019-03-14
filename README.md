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

See [examples](./dist/<angularjs|react>/examples) for more information on how to use each bundle.

## Documentation

LumX's documentation is included in the "demo" directory. The demo/documentation site is built with [Webpack][webpack] and may be run locally.
You can also find an online version of the demo and documentation site at https://design-system.lumapps.com.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md).

## Project installation

[Yarn dependency manager](https://yarnpkg.com/) is recommended to launch the project. Check out the [official installation documentation](https://yarnpkg.com/en/docs/install) if not installed.
You will need Yarn to execute the automatic setup script as well as for publishing the package.

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

You can then open your browser to [http://localhost:4000/](http://localhost:4000/) to access the demo and test site.

For React development server:

```bash
yarn start:react
# Or
npm run start:react
```

You can then open your browser to [http://localhost:4001/](http://localhost:4001/) to access the demo and test site.

## Project build

you can build LumX by using:

```bash
yarn build[:<all|angularjs|react]
# Or
npm run build:<all|angularjs|react>
```

This will produce the target build for either AngularJS or React.

## How to run examples

In the `dist/<angularjs|react>` directory, run:

```bash
yarn install
# Or
npm install
```

This will install `http-server`, a simple HTTP server.

Then run:

```bash
yarn serve
# Or
npm run serve
```

Your browser should open automatically, otherwise, you can go to [http://localhost:8080](http://localhost:8080) for AngularJS example or [http://localhost:8081](http://localhost:8081) for React example.
Then, click on the `examples` directory in the showing listing and you should land on the example page.

## Copyright and license

Code and documentation copyright 2019 LumApps. Code released under the [MIT license](LICENSE.md).

[angularjs]: https://angularjs.org/
[react]: https://react.org/
[material]: http://www.google.com/design/spec/material-design/introduction.html
[angularjs-release]: https://www.npmjs.com/package/@lumx/angularjs
[react-release]: https://www.npmjs.com/package/@lumx/react
[webpack]: https://webpack.js.org/
