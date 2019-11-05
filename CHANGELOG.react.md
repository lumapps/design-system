# Changelog

All notable changes for `@lumx/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Multiple Autocomplete component [#209](https://github.com/lumapps/design-system/pull/209)
-   `isHighlighted` prop for `Chip` component [#209](https://github.com/lumapps/design-system/pull/209)
-   Added `isClearable` and `chips` props for Autocomplete [#209](https://github.com/lumapps/design-system/pull/209)

### Changed

-   `Popover` bug that made the content be displayed on the top left corner.
-   Make autocomplete multiple demo remove a value upon clicking on the entire chip.

### Removed

-   Remove `cursor: pointer` for after-Chip icon.

## [0.13.0][] - 2019-11-04

### Changed

-   Deprecated `ListItemSize` (use `Size` instead).
-   _[BREAKING]_ Remove `Switch` internal state. It's value is now set by the `checked` prop and can be controlled
    with the `onToggle` prop

## [0.12.0][] - 2019-10-30

### Added

-   Text field enhancements (`chips`, `onFocus`, `onBlur`, `textfieldRef`, `inputRef` props) [#199](https://github.com/lumapps/design-system/pull/199)
-   Autocomplete component [#191](https://github.com/lumapps/design-system/pull/191)
-   TypeScript types now available in the NPM @lumx/react package!

### Changed

-   Fix stroke-width property on react progress bar.
-   Fixes to Text Area related to Input resizing and `valid` and `error` states in Material

## [0.11.0][] - 2019-10-23

### Changed

-   TypeScript and JSDoc cleanup for `SideNavigation` component.
-   _[BREAKING]_ The `label` and `helper` of the `RadioButton` component are now props and not children.
-   _[BREAKING]_ The `onChange` callback of the `RadioButton` component now provides the value directly without wrapping object.
-   _[BREAKING]_ The `tags` prop of the `ImageBlock` must now be JSX and not an array.
-   Minor SCSS style changes on the `Tooltip` component.
-   Image Lazy Loading for Thumbnail Component [#190]

### Removed

-   The `tsx` demo of the `SideNavigation` and `RadioButton` component.

## [0.10.0][] - 2019-10-03

### Added

-   Added `EditableMedia` component.

### Changed

-   _[BREAKING]_ The `label` and `helper` of the `Checkbox` component are now props and not children.
-   _[BREAKING]_ The `checked` props of the `Checkbox` component has been renamed `value`.
-   _[BREAKING]_ The `onChange` callback of the `Checkbox` component now has a boolean value argument instead of the `{ checked: boolean }` object
-   TypeScript and JSDoc cleanup for `List` component
-   Adding dark and light theme variant for text and meta blocks for `PostBlock` component.

### Removed

-   The `tsx` demo of the `Checkbox` and `List` component has been removed

[unreleased]: https://github.com/lumapps/design-system/compare/v0.10.0...HEAD
[0.10.0]: https://github.com/lumapps/design-system/tree/v0.10.0
[unreleased]: https://github.com/lumapps/design-system/compare/v0.11.0...HEAD
[0.11.0]: https://github.com/lumapps/design-system/tree/v0.11.0
[unreleased]: https://github.com/lumapps/design-system/compare/v0.12.0...HEAD
[0.12.0]: https://github.com/lumapps/design-system/tree/v0.12.0
[unreleased]: https://github.com/lumapps/design-system/compare/v0.13.0...HEAD
[0.13.0]: https://github.com/lumapps/design-system/tree/v0.13.0
