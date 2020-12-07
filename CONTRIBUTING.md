# Contributing to LumX

We'd love for you to contribute to our source code and to make it even better than it is today!

## Getting the source code

To be able to contribute, you will have to use the global LumX package from our [GitHub repository](https://github.com/lumapps/design-system). You won't be able to contribute from the distributed packages `@lumx/<angularjs|react>`, so be sure to clone the repository before starting contributing:

```bash
git clone git@github.com:lumapps/design-system.git
# Or with HTTPS
git clone https://github.com/lumapps/design-system.git
```

# Table of contents

Here are the guidelines we'd like you to follow.

-   [Code of Conduct](#code-of-conduct)
-   [Got a question or a problem?](#got-a-question-or-a-problem-)
-   [Found an issue?](#found-an-issue-)
-   [Want a feature?](#want-a-feature-)
-   [Want to create a new React Component?](#create-a-new-react-component-)
-   [Submission guidelines](#submission-guidelines)
-   [Coding rules](#coding-rules)
-   [Git commit guidelines](#git-commit-guidelines)

## <a name="code-of-conduct"></a> Code of Conduct

As heavy users of [AngularJS](https://github.com/angular/angular.js) and [React](https://github.com/facebook/react/), we encourage you to read and follow the [AngularJS Code of Conduct](https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md) and the [React Code of Conduct](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md).

## <a name="got-a-question-or-a-problem-"></a> Got a question or a problem?

If you have questions about how to use LumX, please direct these to [StackOverflow](http://stackoverflow.com/questions/tagged/LumX).

## <a name="found-an-issue-"></a> Found an issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our [GitHub Repository](https://github.com/lumapps/design-system/issues). Even better you can submit a Pull Request with a fix.

If you are feeling it, you can even fix the issue yourself and submit a Pull Request.
Before opening a Pull Request, please see the Submission Guidelines below.

## <a name="want-a-feature-"></a> Want a feature?

You can request a new feature by submitting an issue to our [GitHub Repository](https://github.com/lumapps/design-system/issues).
If you would like to implement a new feature then consider what kind of change it is, discuss it with us before hand in your issue, so that we can better coordinate our efforts, prevent duplication of work, and help you to craft the change so that it is successfully accepted into the project.

## <a name="create-a-new-react-component-"></a> Want to create a new React Component?

The first step to create a new React component is to run:

```
yarn scaffold
```

This script will generate a TSX file for the component code, a TSX file for the component tests and an MDX file to demo this component.

To export your component into the `@lumx/react` NPM package, you also have to make sure to update the `src/index.tsx` file.

## <a name="submission-guidelines"></a> Submission guidelines

### Submitting an issue

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue. Help us to maximize the effort by not reporting duplicate issues. Providing the following information will increase the chances of your issue being dealt with quickly:

-   **Motivation for or Use Case** - explain why this is a bug for you
-   **LumX Version(s)** - is it a regression?
-   **Browsers and Operating System** - is this a problem with all browsers ?
-   **Reproduce the Error** - provide a live example (using [Plunker](http://plnkr.co/edit) or [JSFiddle](http://jsfiddle.net/)) or a unambiguous set of steps.

### Submitting a pull request

Before you submit your pull request consider the following guidelines:

-   Search [GitHub](https://github.com/lumapps/design-system/pulls) for an open or closed Pull Request that relates to your submission. You don't want to duplicate effort.
-   Make your changes in a new git branch

```bash
git fetch && git checkout -b <feat|fix|...>/<descriptive branch name> origin/master
```

-   Create your patch.
-   Follow the [Coding Rules](#rules).
-   Commit your changes using a descriptive commit message that follows the [commit message conventions](#commit-message-format).
-   Check and test your changes locally.

*   Push your branch to GitHub:

```bash
git push origin <full branch name>
```

-   In GitHub, send a pull request to `design-system:master`.

If we suggest changes to your Pull Request, then:

-   Make the required updates.
-   Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

```bash
git fetch && git rebase origin/master && git push --force-with-lease
```

That's it! Thank you for your contribution!

#### React developpment check list

If you are developping in React please make sure to follow this check list:

-   [ ] Update the `CHANGELOG.md` file
-   [ ] Create or update component tests
-   [ ] Keep props JSDoc comment up to date and check they appear on the demo site
-   [ ] Keep the `lumx-react/src/index.tsx` file up to date
-   [ ] (if necessary) Create or update the MDX demo file for your component

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

-   Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

```bash
git push origin --delete <full branch name>
```

-   Check out the `master` branch:

```bash
git checkout master -f
```

-   Delete the local branch:

```bash
git branch -D <full branch name>
```

-   Update your `master` branch with the latest upstream version:

```bash
git pull --ff-only upstream master
```

## <a name="coding-rules"></a> Coding rules

We're using ES6 JavaScript, TypeScript and [SCSS](http://sass-lang.com/) to build the framework.
[Webpack](https://webpack.js.org/) is used in the project to launch local development server and build LumX.
NPM scripts are used to ease the setup, start and build of LumX.

The coding convention is the following:

-   4 spaces for indentation, for JavaScript, TypeScript and SCSS.
-   Wrap all codes at 120 characters.

For JavaScript and TypeScript:

-   Use camel-case.
-   Use the [Allman style](http://en.wikipedia.org/wiki/Indent_style#Allman_style).

All submitted JavaScript code must be properly documented. You _must_ at least document all your functions, methods and members using the JSDoc format.

For SCSS:

-   Except for the line wrap, please refer to [the Harry Roberts css guidelines](http://cssguidelin.es/).
-   For the CSS properties, we follow the [concentric order](http://rhodesmill.org/brandon/2011/concentric-css/)

For the ease of use and contributing, most of the coding styles are enforced with ESLint, TSLint, Prettier and StyleLint. So as long as the pre-commit script let you commit, you should be good.

## <a name="git-commit-guidelines"></a> Git commit guidelines

See https://github.com/lumapps/commit-message-validator
