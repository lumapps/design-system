# Changelog

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Added

-   Avatar: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child.
-   UserBlock: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child and used to wrap the username.
-   UserBlock: Added a `nameProps` props which will be passed to the name block.

### Fixed

-   Fixed Tooltip with target element using a function ref instead of object ref.

## [2.2.0][] - 2022-01-21

### Changed

-   Always use colors css variables.
-   Thumbnail badge now have a mask around it even if the `size` prop is undefined.
-   Full internal rework of the Thumbnail component
    -   No change in React API
    -   Improved performance and reduced layout shift
    -   Improved button accessibility with `onClick`
    -   Improved link accessibility with `linkProps` and `linkAs`
    -   Focus point fully reworked
    -   Improved default error fallback state
    -   New skeleton loading state
    -   **Compatibility warning**: using the `aspectRatio` without a `size`, a `fillHeight` or a size constraint from
        the parent element will produce a thumbnail shrunk to 0 pixel

## [2.1.9][] - 2021-12-15

### Fixed

-   Reverted a11y link improvements (`linkAs` and `linkProps`) on Thumbnail, Avatar and UserBlock introduced in v2.1.5 that introduced a regression on the Thumbnail style.

### Changed

-   Soften dark color on medium / low dark buttons, dark chips, dark flags, dark icons, tabs, navigation items and uploaders.

## [2.1.8][] - 2021-12-10

### Fixed

-   Reverted soften dark color on icons that caused issues.

## [2.1.7][] - 2021-12-08

### Fixed

-   Textfield: show the maxlength counter on textfields with no label.
-   UserBlock : Pass `linkAs` prop to Avatar child.

## [2.1.6][] - 2021-12-03

### Fixed

-   Fixed generated typescript types for NPM publication.
-   Fixed release script version and changelog update.
-   Lightbox : Focus parent element only when his lightbox was previously opened.

## [2.1.5][] - 2021-11-30

## Added

-   Thumbnail: Added `linkProps` prop to allow the user to turn a thumbnail into an accessible link.
-   Thumbnail: Added `linkAs` prop into this new prop, to customize the link component.
-   Avatar: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child.
-   UserBlock: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child and used to wrap the username.

### Changed

-   Limit lighten dark color to components: `Button`, `IconButton`, `Chip`, `Flags`, `Tabs`, `Icon`.

## [2.1.4][] - 2021-11-25

### Fixed

-   Slideshow : fixed keyboard navigation, now the right arrow goes to the next slides and the left to the previous one.
-   Dialog : Focus parent element everytime the dialog closes, not only on escape and clickaway.

### Changed

-   Soften medium and low dark buttons color.

## [2.1.3][] - 2021-11-19

### Added

-   `ListItem`: Added `isDisabled` prop to disable a clickable list item.
-   `ListItem`: improve a11y keyboard activation on button list item.

## [2.1.2][] - 2021-11-10

### Fixed

-   Fixed `IconButton` typing by making both `icon` and `image` props conditional.
    This fixes an issue that would occur when extending the interface and forwarding parent props to a children `IconButton`.

### Added

-   `Button`: Added `fullWidth` prop to match the parent width when possible.
-   `TextField`: Added `afterElement` prop to add a custom element at the end of the text field.

## [2.1.1][] - 2021-10-28

### Added

-   New `image` prop for `IconButton`, allowing to use an image url instead of an svg path. Will render a `<img>` tag an can only be set if `icon` prop is undefined (and vice-versa);

## [2.1.0][] - 2021-10-26

### Changed

-   `@lumx/core`: Reworked style dictionary
    -   **Warning: Deprecating CSS and SCSS variables listed in `css/_retro-compat-v2.css` and `_retro-compat-v2.scss`. They will be removed in the next major version!**
    -   Expanded list of customizable CSS variables
    -   Centralized material only design tokens

## [2.0.5][] - 2021-10-20

### Fixed

-   Popover: fix prevent overflow when provided a boundary ref.

## [2.0.4][] - 2021-10-15

### Added

-   New `color` prop for `SkeletonRectangle`, `SkeletonCircle` and `SkeletonTypography`.

## [2.0.3][] - 2021-10-04

### Added

-   New `wide` 16/9 aspect ratio for `Thumbnail`, `Uploader` and `SkeletonRectangle`.

## [2.0.2][] - 2021-09-22

### Fixed

-   Dropdown: fix elevation style
-   Dialog: Fix scroll inside on iOS

## [2.0.1][] - 2021-09-15

### Fixed

-   Dialog/Lightbox: Fix unexpected scroll to top when closing a dialog or lightbox.
-   useInfiniteScroll: Add an error margin of 5px for triggering the infinite scroll so edge cases browser sizes also work.

## [2.0.0][] - 2021-09-01

### Added

-   New `@lumx/core` CSS variable customization.
    -   New lumapps theme applied by default
    -   Old Material theme applicable using variables in `css/material.css`

## [1.0.24][] - 2021-09-01

### Added

-   Message: add `icon` prop to customize the message icon.

## [1.0.23][] - 2021-08-27

### Added

-   Switch: add attribute `aria-checked` for screen readers correct behavior.
-   Dialog: add `onVisibilityChange` prop to trigger an action when the dialog is actually visible / invisible.

## [1.0.22][] - 2021-08-25

### Added

-   Switch: add role `switch` for screen readers correct behavior.

### Fixed

-   IconButton: Fix missing tooltip when activating `hasBackground`
-   IconButton: Fix border radius when activating `hasBackground`

## [1.0.21][] - 2021-08-05

### Fixed

-   ProgressTracker: Fix progress tracker step style regression introduced in v1.0.20

## [1.0.20][] - 2021-08-05

### Fixed

-   Icon: Add missing class to style svg correctly
-   Dialog/Lightbox: Fix unexpected scroll to top when opening a dialog or lightbox.

## [1.0.19][] - 2021-07-15

### Added

-   AutoComplete: Added `isRequired` prop to the component to indicated if field is required
-   AutoCompleteMultiple: Added `isRequired` prop to the component to indicated if field is required

### Fixed

-   TextField: Add space after asterisk if component has `isRequired` props

## [1.0.18][] - 2021-06-28

### Added

-   AlertDialog: props forwarding on the confirm and cancel buttons.

### Fixed

-   Fix Select/Dropdown inside Dialog not closing when clicking outside.
-   Fix Select focus state not updating correctly.

## [1.0.17][] - 2021-05-27

### Fixed

-   Fixed slideshow swipe on touch devices
    -   Fix vertical scroll (previously blocked)
    -   Fix mouse/touch click in a slide (previously blocked)
    -   Do not loopback to the end or start when trying to swipe on the last or first slide
    -   Improved performance

## [1.0.16][] - 2021-05-20

### Changed

-   Keep slideshow swipe only on touch device.

### Fixed

-   Updated lodash from 4.17.19 to 4.17.21 to fix potential security risks.

## [1.0.15][] - 2021-05-03

### Added

-   Added `hideTooltip` prop to `IconButton` component to control whether the tooltip should be hidden or not.
    Default at `false`.

### Changed

-   Changed `IconButton` jsdoc.

## [1.0.14][] - 2021-04-23

### Fixed

-   Increase specificity of link color CSS classes to avoid incorrect color overrides.

## [1.0.13][] - 2021-04-13

### Fixed

-   Limit thumbnail resize update using `requestAnimationFrame` to avoid the `ResizeObserver loop limit exceeded` error.

## [1.0.12][] - 2021-03-11

### Fixed

-   Fixed tabs and progress tracker active index synchronization.

## [1.0.11][] - 2021-02-26

### Added

-   Added `boundaryRef` prop to `Popover` component to override default boundary settings.

### Fixed

-   Fixed overflow on avatar badge.

## [1.0.10][] - 2021-02-25

### Fixed

-   Make `TableRow` component's `tabIndex` controllable.
-   Allow `typography` to be overriden.
-   `Thumbnail` aspect ratio for `Avatar` is now fixed to `square`. This is not a breaking change since the style has been modified to result in the same render as before. This modification prevents rectangular avatars to have a broken ratio.

### Changed

-   Cleanup `Flag` makup and styles
-   Use `uid` instead of `uniqueid` for `Checkbox` default id.
-   Use `uid` instead of `uniqueid` for `RadioButton` default id.

## [1.0.9][] - 2021-02-22

### Fixed

-   Fixed `TabProvider` & `ProgressTrackerProvider` not calling `onChange` when the index is not provided via the props.
-   Fixed `Link` default style when in button mode (padding + text align).

### Added

-   New component in React: `Flag`

## [1.0.8][] - 2021-02-08

### Added

-   Added `light` theme by default on Skeleton components.
-   Added `badge` prop on `Thumbnail` component.

## [1.0.7][] - 2021-02-03

### Fixed

-   Fixed `AlertDialog` export.
-   Fixed `Thumbnail` image overflowing instead of scaling to the parent height.

## [1.0.6][] - 2021-02-02

### Fixed

-   Fixed initial internal state for `TabProvider` (fixes lazy feature that would still render children once).

## [1.0.5][] - 2021-02-02

### Added

-   Added `dialogProps` prop to `Dialog` component to app props the dialog element itself.
-   Added `AlertDialog` component that is a `Dialog` contextualized to show short messages and
    that follows the [WAI-ARIA `alertdialog` a11y patterns](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/alertdialog.html).
-   Added `alert` role to `Notification` component for a11y purposes.

### Fixed

-   Fixed focus on parentElement of the `Dialog` component.
-   Fixed closing of tooltip when the anchor element gets hidden by another element.

## [1.0.4][] - 2021-01-25

### Fixed

-   Restored JS mdi icon `google-pages` that was removed with mdi v4.

## [1.0.3][] - 2021-01-21

### Added

-   Added `usePortal` prop to `Popover` component (default value is `true`) to be able to not use a portal in some cases.

### Fixed

-   Fixed `Switch` content placement for `right` position.
-   Fixed `Lightbox` close on escape witch slideshow inside.
-   Fixed `Thumbnail` focus point when clickable.
-   Fixed `Thumbnail` focus state style.
-   Fixed `Thumbnail` fallback placement.
-   Fixed `Thumbnail` fill height style.
-   Fixed `TabProvider` and `ProgressTrackerProvider` state on unmout/remount.

## [1.0.2][] - 2021-01-18

### Fixed

-   Fixed angular z-index system (revert to previous system)
-   Fixed `Lightbox` close on escape.

## [1.0.1][] - 2021-01-13

### Fixed

-   Fixed `@lumx/react` `package.json` metadata
-   Fixed component TS type

## [1.0.0][] - 2021-01-07

### Added

-   Added `avatarProps` to `CommentBlock` to allow setting custom props to the avatar.
-   Added `linkProps` to `LinkPreview` to allow setting custom props to the link.
-   Added `avatarProps` to `UserBlock` to allow setting custom props to the avatar.
-   Added `thumbnailProps` to `PostBlock` to allow setting custom props to the thumbnail.
-   Added props forwarding to `Lightbox` component.
-   Added `name` and `value` props to `Switch`, `CheckBox` and `RadioButton` components.
-   Added `name` prop to `Autocomplete`, `DatePicker`, `TextField`, `Button`, `IconButton` and `Slider` components.
-   Expose component default props in React `Component.defaultProps`
-   A `Link` component without an `href` would result in a button looking like a link instead of an anchor.
-   Added `typography` prop to `Link` component.
-   Added `TabProvider` component wrapping the new `TabList` and `TabPanel` and handling state (controlled or uncontrolled).
-   Added `TabPanel` component that wraps the content of a tab (previously wrapped in the `Tab` component). Implements the [WAI-ARIA `tabpanel` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label).
-   Added `TabList` component that wraps `Tab` components. Implements the [WAI-ARIA `tablist` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label).
-   Added `ProgressTrackerProvider` component wrapping the new `ProgressTracker` and `ProgressTrackerStepPanel` and handling state (controlled or uncontrolled).
-   Added `ProgressTrackerStepPanel` component that wraps the content of a step. Implements the [WAI-ARIA `tabpanel` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label).
-   Added `isDisabled` prop to `ProgressTrackerStep` component.
-   Added `rightIcon` and `leftIcon` props for `Link` component. Sizes of icons are based on `typography` prop.
-   _[BREAKING]_ Added required `label` prop for `IconButton`. The label is used as `aria-label` for the button and to add a tooltip. This prop is required for a11y purpose. If you really don't want a tooltip, you can give an empty label (this is not recommended).
-   _[BREAKING]_ Added `nextButtonProps` and `previousButtonProps` props to `DatePickerControlled`, `DatePicker` and `DatePickerField` components to allow setting custom props to the `IconButton`s used to change month. These fields are **required** because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   _[BREAKING]_ Added `nextButtonProps` and `previousButtonProps` props to `SlideshowControls` component to allow setting custom props to the `IconButton`s used to change image. These fields are **required** because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   Added `slideshowControlsProps` to the `Slideshow` component to allow setting custom props to the slideshow controls. Controls are not displayed if this prop is not set.
-   _[BREAKING]_ Added `toggleButtonProps` prop to `ExpansionPanel` component to allow setting custom props to the `IconButton`s used to toggle the panel. This field is **required** because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   _[BREAKING]_ Added `toggleButtonProps` prop to `SideNavigationItem` component to allow setting custom props to the `IconButton`s used to toggle the menu. This field is **required** because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   Added `clearButtonProps` prop to `Select` component to allow setting custom props to the `IconButton`s used to clear the select. This prop is not required since the icon button is not automatically displayed. However, when used to display the button, the `label` prop inside the `clearButtonProps` prop will be required because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   Added `clearButtonProps` prop to `TextField` component to allow setting custom props to the `IconButton`s used to clear the field. This prop is not required since the icon button is not automatically displayed. However, when used to display the button, the `label` prop inside the `clearButtonProps` prop will be required because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   Added `closeButtonProps` prop to `Lightbox` component to allow setting custom props to the `IconButton`s used to close the lightbox. This prop is not required since the icon button is not automatically displayed. However, when used to display the button, the `label` prop inside the `closeButtonProps` prop will be required because translation are not handled inside the Design System and the `IconButton` now requires a `label` for a11y purposes.
-   Added `tooltipProps` to `IconButton` to allow setting custom props to the tooltip.
-   _[BREAKING]_ Added `htmlFor` prop required for `InputLabel` since it is required for `<label>` for a11y purposes.
-   Added forwarded props to the `Select` component.
-   Added `variant` prop for `CommentBlock` component (either `indented` by default or `linear`).

### Changed

-   _[BREAKING]_ Renamed `url` prop to `link` for `LinkPreview` component.
-   _[BREAKING]_ Renamed `onToggle` prop to `onChange` for `Switch` component.
-   _[BREAKING]_ `avatar` prop from `UserBlock` component is now a string and corresponds to the avatar url. Any other avatar props should be passed to `avatarProps` prop.
-   _[BREAKING]_ Renamed `handleClick` prop to `onClick` and `actionCallback` prop to `onActionClick` for `Notification` component.
-   _[BREAKING]_ Renamed `closeCallback`, `openCallback` and `toggleCallback` props respectively to `onClose`, `onOpen` and `onToggleOpen` for `ExpansionPanel` component.
-   _[BREAKING]_ `Checkbox` now uses `checked` (edit: and its alias `isChecked`, see below) prop instead of `value` prop to know whether it is toggled on or not. This is more consistant with HTML native naming convention and this is also how it is used for `RadioButton` and `Switch`. As said above, `value` has been added as prop and acts like the HTML native prop `value`.
-   _[BREAKING]_ Changed `onChange` method signature for `RadioButton` component. This is breaking since now the `value` argument of `onChange` method is required.
-   Changed `onChange` method signature for `Switch`, `CheckBox`, `Autocomplete`, `TextField`, `DatePicker` and `Slider` components.
-   `isDisabled` prop is now the official name for the disabled state of all components (although `disabled` will also work for compatibility with the HTML `disabled` attribute)
-   `isChecked` prop is now the official name for the checked state of all checkable components (although `checked` will also work for compatibility with the HTML `checked` attribute).
-   _[BREAKING]_ The prop `value` of `TextField` component can not be a `number` anymore. The user would have to cast the value on its side.
-   _[BREAKING]_ Renamed `hideMinMaxlabel` prop to `hideMinMaxLabel` for `Slider` component.
-   Default color of `Badge` is now `primary`.
-   _[BREAKING]_ `Tab` component doesn't wrap the tab content anymore (use `TabPanel` for that). Implements the [WAI-ARIA `tab` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label).
-   _[BREAKING]_ `onClick` prop for `Mosaic.thumbnail` prop is no longer automatically passing the index.
-   `ProgressTracker` component now implements the [WAI-ARIA `tablist` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label).
-   _[BREAKING]_ `activeStep` prop for `ProgressTracker` component has been removed and is now handled by `ProgressTrackerProvider` component.
-   `ProgressTrackerStep` components are button instead of anchor for better a11y. Aria attributes have been added according to [WAI ARIA `tab` role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html) since stepper are similar to tabs in term of a11y.
-   _[BREAKING]_ `onClick` prop for `ProgressTrackerStep` component is not used anymore. `ProgressTrackerProvider` component has an `onChange` prop instead. Therefore, a step is now clickable if it is not disabled.
-   _[BREAKING]_ `DatePicker` and `DatePickerField` `value` prop can no longer be a `Moment` object. This will allow us to remove `moment` dep in the future without generating breaking change later. The `value` prop can no longer be a `string` to avoid handling incompatible values. `value` can only be a `Date` (or `undefined` for non selectable values).
-   _[BREAKING]_ Thumbnail `loading` prop now take `eager` or `lazy` string (instead of enum).
-   _[BREAKING]_ `@lumx/react` is now exported as an ESM module targeting the [browserlist `defaults` query](https://github.com/browserslist/browserslist#full-list). The package is not compatible with IE anymore. You can keep the compatibility by configuring your own polyfills and/or transpilation in your build setup.
-   _[BREAKING]_ `lodash` is now defined as a `peerDependencies`. You must install them separately from the `@lumx/react` package.
-   _[BREAKING]_ Replaced `buttonRef` by `ref` in `Button` and `IconButton` components.
-   _[BREAKING]_ Replaced `buttonGroupRef` by `ref` in `ButtonGroup` component.
-   _[BREAKING]_ Replaced `chipRef` by `ref` in `Chip` component.
-   _[BREAKING]_ Replaced `iconRef` by `ref` in `Icon` component.
-   _[BREAKING]_ Replaced `linkRef` by `ref` in `Link` component.
-   _[BREAKING]_ Replaced `listElementRef` by `ref` in `List` component.
-   _[BREAKING]_ Replaced `popoverRef` by `ref` in `Popover` component.
-   _[BREAKING]_ Replaced `userBlockRef` by `ref` in `UserBlock` component.
-   _[BREAKING]_ The alternative text is now required (`alt` prop in `Thumbnail`, `thumbnails[].alt` in `Mosaic`, `alt` in `ImageBlock`, `thumbnailProps.alt` in `PostBlock`, `thumbnailProps.alt` in `LinkPreview`, `alt` in `Avatar`, `avatarProps.alt` in `CommentBlock` and `avatarProps.alt` in `userBlock`).
-   _[BREAKING]_ The title is now required in `ImageBlock`.
-   _[BREAKING]_ Reworked Thumbnail CORS default. `crossOrigin` now default to `undefined` instead of `'anonymous'`. `isCrossOriginEnabled` prop was removed (use `crossOrigin={undefined}` instead).
-   _[BREAKING]_ Upgrade to mdi v5.8.55 and handle backward compatibility (see [details]([./packages/lumx-icons/README-v4-to-v5-migration.md])).
-   `Avatar` component now uses `Thumbnail` component.
-   _[BREAKING]_ Since `alt` in now required for `Avatar`, `avatar` and `avatarProps` props have been merged into `avatarProps` for both `CommentBlock` and `UserBlock`.
-   _[BREAKING]_ Removed `ListItemSize` (use `Size` instead), `TabListPosition` (use `Alignment` instead), `SwitchPosition` (use `Alignment` instead), `ThScope` (was not used).
-   _[BREAKING]_ Renamed `Kind.valid` into `Kind.success` and removed `MessageKind` and `NotificationType` (use `Kind` instead).
-   Loosened enum type so you can use the string value instead (ex: you can use `'s'` instead of `Size.s`).

### Removed

-   _[BREAKING]_ Removed `HTMLElement` as type in `PostBlock` component props.
-   _[BREAKING]_ Removed `onOpen` prop from `Dialog` component. User should use `isOpen` from its side.
-   _[BREAKING]_ Removed `thumbnailAspectRatio` prop from `PostBlock` component. User should pass it using `thumbnailProps` instead.
-   _[BREAKING]_ Removed `onOpen`, `role` and `noWrapper` props from `Lightbox` component.
-   _[BREAKING]_ `aspectRatio`, `crossOrigin`, `focusPoint`, `isCrossOriginEnabled` and `onClick` props have been removed from `ImageBlock` component. These props will now be passed using the `ImageBlock.thumbnailProps` prop.
-   _[BREAKING]_ Removed `Tabs` component replaced by the `TabProvider` and `TabList` components.
-   _[BREAKING]_ Removed `thumbnails.url` prop on the `Mosaic` (use `image` instead).
-   _[BREAKING]_ `isClosingButtonVisible` prop of `Lightbox` component has been removed. Passing the `label` prop using `closeButtonProps` prop is enough to determine the visibility of the icon button.
-   _[BREAKING]_ `isClearable` prop of `TextField`, `Autocomplete` and `AutocompleteMultiple` components has been removed. Passing the `label` prop using `clearButtonProps` prop is enough to determine the visibility of the icon button.
-   _[BREAKING]_ `hasControls` prop of `Slideshow` component has been removed. Using `slideshowControlsProps` prop is enough to determine the visibility of the slideshow controls.
-   _[BREAKING]_ `hasChildren` and `hasIndentedChildren` props for `CommentBlock` component have been removed.
-   _[BREAKING]_ Removed `isFollowingWindowSize` and `resizeDebounceTime` on `Thumbnail`.
-   _[BREAKING]_ Removed `useCustomColors` props (component colors will be customizable using CSS variable overrides).
-   _[BREAKING]_ Removed `lumapps` & `material` theme in `@lumx/color` (we now provide a single theme overridable with CSS variables)

### Fixed

-   Fixed `DatePicker` component to prevent switching month when selecting a date.
-   Fixed `Tooltip` placement on `Icon` and `IconButton`.
-   Fixed `Switch` component. Its content should not take the full width of its parent.
-   Fixed image cache in `Thumbnail`.
-   Fixed focus point performance in `Thumbnail` (full rewrite using react hooks).

## [0.28.2][] - 2020-12-11

### Added

-   Added `headerActions` prop to `CommentBlock` component to add actions to the header.
-   Added `SkeletonRectangle`, `SkeletonCircle` and `SkeletonTypography` components.

### Fixed

-   Fixed `text` prop of the `CommentBlock` component to accept `ReactNode` type.

## [0.28.1][] - 2020-12-03

### Fixed

-   Fixed ClickAwayProvider initialization error using deferred initialization.
-   Fixed `Popover` placement on children update.
-   Fixed `Popover` and `Dropdown` scrollbar behavior.
-   Fixed `Popover` arrow placement on placement variant `start` and `end`.

### Added

-   Forward synthetic event in List `onListItemSelected` prop and ListItem `onItemSelected` prop.

## [0.28.0][] - 2020-11-17

### Changed

-   _[BREAKING]_ `angular` and `jquery` are now exclusively defined as `peerDependencies`. You must install them separately from `@lumx/angularjs`.
-   _[BREAKING]_ updated `@lumx/angularjs` to jquery v3.5.1.

## [0.27.0][] - 2020-11-05

### Changed

-   _[BREAKING]_ `react`, `react-dom`, `moment` and `moment-range` are now exclusively defined as `peerDependencies`. You must install them separately from `@lumx` packages.

## [0.26.2][] - 2020-10-28

### Added

-   Added component `SlideshowControls` to control a slideshow from the outside
-   Add `linkAs` prop on `Button` and `IconButton` to customize the link component (can be used to inject the `Link` component from `react-router`).

### Changed

-   `Link` prop type is now more permissive to accommodate for alternative components injected in `linkAs`.
-   Expose component default props in React's `Component.defaultProps`
-   Make it possible to override `tabIndex` and `role` props of `ListItem.linkProps`.

### Fixed

-   Fixed page freeze when trying to use keyboard navigation on `List` component that has custom children.

## [0.26.1][] - 2020-10-14

### Changed

-   _[BREAKING]_ Downgrade mdi back to v4.2.95.

## [0.26.0][] - 2020-10-13

### Added

-   Add `gap` property to `FlexBox` component.
-   Add has divider helper.
-   Add optional `closeOnClick` property to `Select` component.
-   Add `linkAs` prop on `SideNavigationItem`, `ListItem` and `Link` to customize the link component (can be used to inject the `Link` component from `react-router`).

### Changed

-   _[BREAKING]_ Upgrade to mdi v5.6.55 and handle backward compatibility.
-   _[BREAKING]_ `lumx-has-divider` mixin now accepts a position constant as second parameter (`lumx-base-const('position', 'TOP|RIGHT|BOTTOM|LEFT')`).

## [0.25.16][] - 2020-09-16

### Added

-   Add `thumbnailProps` to `ImageBlock` to allow setting custom props to the thumbnail.

## [0.25.15][] - 2020-09-08

### Fixed

-   Fix `Thumbnail` css issues when displayed with `lumx-thumbnail--fill-height` classname.

## [0.25.14][] - 2020-09-03

### Added

-   Add `onActionClick` on `SideNavigationItem` to have a dedicated action on the chevron icon and let the onClick on the link.

### Fixed

-   Fix `Thumbnail` component loading issues for firefox

## [0.25.13][] - 2020-09-01

### Fixed

-   Fix CORS issues on `Thumbnail` component
-   Fix `Thumbnail` component loading and error state handling
-   Remove anchor wrapper style from `Tooltip` component.

### Added

-   Add `isCrossOriginEnabled` and `crossOrigin` missing props on `ImageBlock` component to forward them to `Thumbnail` component

## [0.25.12][] - 2020-08-31

### Fixed

-   Pass type props to input on `TextField` component.

## [0.25.11][] - 2020-08-27

### Changed

-   `SideNavigationItem` is now able to handle 2 actions. On the label link and on the chevron icon button.
-   `SideNavigation` is now indented on its children menus.

## [0.25.10][] - 2020-08-26

### Fixed

-   Use locale prop on `DatePickerField` component.

## [0.25.9][] - 2020-08-25

### Fixed

-   Make `Thumbnail` appear correctly on Safari into `Mosaic` component.

### Added

-   Added `ThumbnailProps` props to the `MosaicElement` interface to be able to forward those props to the `Thumbnail` component inside the `Mosaic`component.
-   Added `fitWithinViewportHeight` prop on the `Dropdown` to disable the height shrinking.

### Changed

-   `Tooltip` are now displayed on `focus` in addition with `mouse` events.

## [0.25.8][] - 2020-08-05

### Fixed

-   Fix frozen `Tooltip` when changing disabled state of a button wrapped in a tooltip.

## [0.25.7][] - 2020-08-04

### Fixed

-   Fixed and improved `Dropdown` shrinking system.
-   Fixed unwanted scroll to the top on the screen when opening a `Dropdown`.
-   Fix `Tooltip` display on disabled anchor.

### Changed

-   Improved `useInfiniteScroll` to prevent conditional hooks.

### Added

-   Added `focusElement` prop to the `Popover` component to be able to focus on open.

## [0.25.6][] - 2020-07-31

### Fixed

-   `Dropdown` placement is not limited to `bottom`, `bottom-start` and `bottom-end` anymore.
-   `Tooltip` anchor is wrapped only if it is not a Button, IconButton, Icon or React HTML Element. Removed `inline-block` display style.
-   Fixed `Popover` maxHeight when value is NaN.
-   Fixed `InputLabel` and `InputHelper` bad display (flex instead of block)

## [0.25.5][] - 2020-07-23

### Changed

-   _[BREAKING]_ `Tooltip` placement is now `bottom` by default.

## [0.25.4][] - 2020-07-22

### Fixed

-   `ListItem` now properly keep the given `isHighligthed` prop value when controlled from a parent component. Fixes `Autocomplete` & `AutocompleteMultiple` keyboard arrow navigation in the completed suggestions.
-   _[BREAKING]_ `Tooltip` placement is now `top` by default.

### Changed

-   _[BREAKING]_ `Dropdown` placement is limited to `bottom`, `bottom-start` and `bottom-end`.

## [0.25.3][] - 2020-07-01

### Fixed

-   `Popover` (and `Dropdown`) now fits to anchor width using min width.
-   `Dropdown` now has `BOTTOM` placement by default.
-   Fix `Popover` click away wrapper reference.

## [0.25.2][] - 2020-06-30

### Added

-   `Tooltip` can have a multiline `label` by putting `\n` character inside the string.

### Changed

-   `Tooltip` does not appear if the `label` is empty, `null` or `undefined`.

## [0.25.0][] - 2020-06-29

### Added

-   `ListItem` component is now able to use a link as HTML element to wrap content.
-   Click away and escape are handled inside the `Popover` using `closeOnClickAway` and `closeOnEscape` props.
-   The `Popover` can now have an anchor.
-   `Popover` now can show an arrow pointing on the anchor using the `hasArrow` prop.
-   `label` prop has been added to `Tooltip` component.
-   `fitWithinViewportHeight` props has been added to `Popover` component (`false` by default, set to `true` for `Dropdown`). It shrink the popover if there is not enough space even after flipping.

### Changed

-   `List` no longer requires to have the `isClickable` prop set to have the correct styling on clickable list item.
-   `List` keyboard navigation now correctly skips non clickable list items.
-   `ListItem` component is now able to use a link as HTML element to wrap content
-   _[BREAKING]_ `Popover.useComputePosition` hook has been removed.
-   _[BREAKING]_ `Offset` type does not have `vertical` and `horizontal` keys anymore but has `along` and `away` props.
-   _[BREAKING]_ `Popover` computes position internally and add popover ref internally. Click away and escape are handled inside the popover. The popover can now have an anchor. `popoverRect`, `isVisible` and `popoverRef` props have been removed. `anchorRef`, `placement`, `offset`, `fitToAnchorWidth`, `isOpen`, `closeOnClickAway`, `closeOnEscape`, `onClose` and `hasArrow` props have been added.
-   _[BREAKING]_ `Tooltip` takes anchor as children and label as prop. `anchorRef` prop has been removed. `label` prop has been added.
-   _[BREAKING]_ For the `Dropdown` component, the prop `closeOnClick` now controls whether to close the dropdown when clicking inside it whereas the `closeOnClickAway` prop controls whether to close the dropdown when clicking outside. The prop `showDropdown` has been renamed `isOpen`. Also, see `Offset` typing change.
-   _[BREAKING]_ For the `Autocomplete` component, the prop `closeOnClick` has been renamed `closeOnClickAway`. Also, see `Offset` typing change.

### Fixed

-   Remove required prop on `lx-text-field` and `lx-select` input label
-   Fix calendar display for the `DatePicker`.
-   Fix on `Tooltip` that would persist even after the mouse has been moved out of the anchor.
-   `AutocompleteSimple` and `Select` now automatically close when a value is selected.

## [0.24.3][] - 2020-06-24

### Fixed

-   _[BREAKING]_ Changed `thumbnailProps` prop type from `LinkPreview` to avoid typescript throwing an error if `thumbnailProps.image` was not specified even though it is already set by the `image` prop.
-   Allow event propagation on before/after element on `Chip` component when no handler is provided.
-   Fix error in storybook using `useComputePosition`-based components.

## [0.24.2][] - 2020-06-18

### Fixed

-   `Mosaic` component is now correctly displayed on IE11.
-   Fix missing grey color (in material theme) in the generated SCSS color palette

## [0.24.0][] - 2020-06-11

### Fixed

-   `TextField` component is now computing the number of rows (if `multiple` is set) at the first rendering.
-   Fix centering issue on fallback icon in `Thumbnail` component when using `fillHeight`prop.
-   Fix nested click away for `Dialog`, `Dropdown`, `Select` and `Autocomplete` (this fixes the dialog automatically closing when clicking on a nested select or dropdown.)
-   Fix position of the dropdown arrow icon when the select has no value (Material theme).

### Changed

-   The `DatePicker` and `DatePickerFields` components now accept a javascript Date object or string as value.
-   _[BREAKING]_ Removed SCSS variables `$lumx-theme-{primary,blue,...}`
-   _[BREAKING]_ Renamed SCSS variables `$lumx-theme-{primary,blue,...}-{N,L1,...}` into `$lumx-color-{primary,blue,...}-{N,L1,...}`
-   _[BREAKING]_ Renamed SCSS variable `$lumx-theme-border-radius` into `$lumx-border-radius`
-   _[BREAKING]_ Renamed SCSS mixin `lumx-theme-color-variant()` into `$lumx-color-variant()`
-   _[BREAKING]_ Renamed SCSS mixin `lumx-theme-best-color()` into `$lumx-best-color()`
-   _[BREAKING]_ Renamed CSS classes `.lumx-theme-color-*` into `.lumx-color-font-*`
-   _[BREAKING]_ Renamed CSS classes `.lumx-theme-background-*` into `.lumx-color-background-*`
-   Handle default size on fallback icon in `Thumbnail` component (Size.m).

## [0.23.0][] - 2020-05-29

### Added

-   Added optional `defaultMonth` prop to components `DatePickerField` and `DatePicker`.
-   Added optional `imgProps` prop to component `Thumbnail`.
-   Added optional `fallback` prop (svg string or react node) to component `Thumbnail`.
-   Added `thumbnailProps` prop to `LinkPreview`.
-   Added `useImage` hook to preload an image and get states from it (isLoaded and hasError).

### Changed

-   _[BREAKING]_ Replaced `today` and `monthOffset` props by `selectedMonth` for `DatePickerControlled` component.

### Fixed

-   Trigger the infinite scroll callback on display if enough space with the `useInfiniteScroll` hook.
-   Fixed chips taking place before icons in `TextField` component.
-   Fixed `Mosaic` thumbnails showing as clickable even though `onClick` wasn't defined.
-   _[BREAKING]_ Fixed prop Interfaces of `Autocomplete` and `Dropdown` by changing `onInfinite` to `onInfiniteScroll`.
-   Added `type="button"` to `TextField` "clear" button when `isClearable` is `true` to avoid clearing field when user tries to submit a form.
-   Moved `useFocusedImage` to `hooks` folder.

## [0.22.0][] - 2020-04-21

### Changed

-   _[BREAKING]_ The component `WebBookmark` has been renamed `LinkPreview`.
-   _[BREAKING]_ split `Select` component into `Select` (with single value selected) and `SelectMultiple` for multiple value selected
-   Remove wrapper sentinel to only use css for scrollable `Dialog`

### Fixed

-   Fix for `LinkPreview`: elements linked to optional props are no longer rendered when the related prop is not defined.

## [0.21.19][] - 2020-04-16

-   Added `hasIndentedChildren` prop to `CommentBlock` component

## [0.21.18][] - 2020-04-16

-   Fix `SideNavigationItem` link color

## [0.21.17][] - 2020-04-15

### Added

-   Added `linkProps` prop to `SideNavigationItem` component
-   Declared `@lumx/react`, `@lumx/icons` and `@lumx/core` as side-effect free

## [0.21.16][] - 2020-04-10

### Fixed

-   Fix padding on `Chip` component if has after or has before

## [0.21.15][] - 2020-04-01

### Added

-   Added `contentRef` prop to `Dialog` component
-   Added `linkRef` on `Link` component

### Fixed

-   Fixed blurry Tooltip

## [0.21.14][] - 2020-03-27

### Added

-   Added `isCrossOriginEnabled` prop to `Tumbnail` component
-   Added `crossOrigin` prop to `Tumbnail` component
-   Added `isFollowingWindowSize` prop to `Tumbnail` component
-   Added `resizeDebounceTime` prop to `Tumbnail` component

## [0.21.13][] - 2020-03-23

### Fixed

-   Allow number type on `TextField` component value

## [0.21.12][] - 2020-03-16

### Fixed

-   Fix thumbnail image loading on IE
-   Fix thumbnail focus point update when changing size or aspect ratio

## [0.21.11][] - 2020-03-12

### Added

-   Publish source code on NPM for `@lumx/react`

## [0.21.10][] - 2020-03-12

### Added

-   New component in React: `FlexBox`
-   New component in React: `Mosaic`
-   Added `size` prop to `WebBookmark` component
-   Added `badge` prop to `Avatar` component
-   Change `avatar` prop of `UserBlock` component from `string` to `AvatarProp | string` to pass badge properties

### Changed

-   Added ReactNode as an allowed type for the label of the `SideNavigationItem` for typescript support
-   _[BREAKING]_ Rename `IBaseBadgeProps` as `BadgeProps`
-   _[BREAKING]_ Rename `IInputHelperProps` as `InputHelperProps`
-   _[BREAKING]_ Rename `IInputLabelProps` as `InputLabelProps`
-   _[BREAKING]_ Rename `IFocusPoint` as `FocusPoint`
-   Added ReactNode as an allowed type for the label of the `Tab` component for typescript support

### Fixed

-   Fixed `Link` component Typescript types

## [0.21.9][] - 2020-02-20

### Added

-   New component in React: `Link`
-   Added `onBlur` prop to `Select` component
-   New component in React: `WebBookmark`

## [0.21.8][] - 2020-02-19

### Added

-   Added `focusPoint` prop to `ImageBlock` component

## [0.21.7][] - 2020-02-14

### Added

-   Added `focusPoint` prop to `Thumbnail` component

## [0.21.6][] - 2020-02-13

### Added

-   Added `isRequired` prop to `InputLabel`, `TextField` and `Select` components
-   Added `lx-is-required` prop to `lx-input-label`, `lx-text-field` and `lx-select` components

### Changed

-   Close popover on `DatePickerField` date pick
-   Pass appropriated `DatePickerField` props to `TextField` component

### Fixed

-   Correctly init value by ignoring time on `DatePicker` component
-   Move `textFieldRef` to `TextField` component wrapper
-   Prevent `Notification` to be visible when `isOpen` is false

## [0.21.5][] - 2020-02-10

### Added

-   `@lumx/core` is now in full TypeScript (exposed on NPM)
-   `@lumx/icons` now exposes TypeScript types on NPM
-   `@lumx/react` now exposes TypeScript types on NPM

## [0.21.4][] - 2020-02-04

### Added

-   Added `isDisabled` prop to `TableRow` component
-   Added `lx-is-disabled` prop to `lx-table-row` component

### Fixed

-   Interpolate variables when using `lx-input-label` and `lx-input-helper` components

## [0.21.3][] - 2020-02-03

### Added

-   Added `isClickable` and `isSelected` props to `Table` component

## [0.21.2][] - 2020-02-01

### Fixed

-   Reset input label cursor on `ProgressTracker`
-   Apply `TextField` input min width only if has chips

## [0.21.1][] - 2020-01-31

### Fixed

-   Do not display `TextField` and `Select` header if no label

## [0.21.0][] - 2020-01-30

### Fixed

-   Remove useless `List` auto-focus on mount if is clickable

### Changed

-   _[BREAKING]_ Externalized `moment` and `moment-range` dependencies from @lumx/react bundle

## [0.20.1][] - 2020-01-29

### Fixed

-   Fixed Dropdown focus trigger on open and close (fix on `useFocus` hook).

## [0.20.0][] - 2020-01-28

### Changed

-   _[BREAKING]_ Changed `type` prop to `multiline` flag prop in the `TextField` component
-   _[BREAKING]_ Changed `lx-checkbox-help` transclude slot to `lx-checkbox-helper` from `lx-checkbox` component
-   _[BREAKING]_ Changed `lx-radio-button-help` transclude slot to `lx-radio-button-helper` from `lx-radio-button` component
-   _[BREAKING]_ Changed `lx-switch-help` transclude slot to `lx-switch-helper` from `lx-switch` component
-   _[BREAKING]_ Changed `lx-error` prop to `lx-has-error` from `lx-text-field` and `lx-select` components
-   _[BREAKING]_ Changed `lx-valid` prop to `lx-is-valid` from `lx-text-field` and `lx-select` components
-   _[BREAKING]_ Changed `lx-helper` prop to `lx-has-choices-helper` from `lx-select` component
-   _[BREAKING]_ Changed `lx-helper-message` prop to `lx-choices-helper` from `lx-select` component
-   Use the `useFocusOnOpen` hook to focus on the `List` child of a `Dropdown`
-   Refactored `DatePicker` component to use Popover instead of Dropdown

### Fixed

-   Fix: dialog focus trap interacting with other components (select, text field, etc.).
-   Fix: dialog click away at the bottom of the dialog
-   Fixed `Popover` pixelated rendering
-   Remove `Popover` closing when the anchor is out of the screen
-   Fixed `Dropdown` position re-calculation when children changes

### Added

-   Added `helper` prop to `TextField` component
-   Added `error` prop to `Autocomplete`, `Select` and `TextField` component
-   Added `lx-helper` and `lx-error` props to `lx-text-field` and `lx-select` components
-   Added `Message` component
-   Added `useFocus` hook
-   Added `focusElement` prop on dialog to select the element to focus when opening the dialog
-   Added `forceHeaderDivider` and `forceFooterDivider` props on dialog force the display of header and footer dividers
-   Added use of `<header>` and `<footer>` element in the dialog component
-   Added `size` prop to `ImageBlock` component
-   Added `lx-size` prop to `lx-image-block` component
-   Added keyboard interaction to `DatePicker` component
-   Added `useFocusTrap` on `DatePickerField`
-   Added `clearable` prop on `DatePickerField`

## [0.19.0][] - 2020-01-02

### Changed

-   _[BREAKING]_ Removed `variant` prop from `expansionPanel` component
-   _[BREAKING]_ Removed `isClickable` prop from `ListItem` component (use it on the `List` instead)

### Added

-   Added `hasBackground` prop to `expansionPanel` component
-   Added `hasShape` prop to `icon` component
-   Added `theme` prop to `icon` component
-   Added `itemPadding` prop to `list` component
-   Added `badge` component

## [0.18.9][] - 2019-12-13

-   When we are using the AutocompleteMultiple, you can now just display the suggestions with the same size as the input.
-   For the Autocomplete simple, we add the possibility to prevent refocus on close.

## [0.18.7][] - 2019-12-06

-   Added `maxLength` prop to `textField` component
-   _[BREAKING]_ Removed `helper` prop from `textField` component

## [0.18.5][] - 2019-12-04

### Added

-   Add `zIndex` props on every appearing component

## [0.17.0][] - 2019-11-28

### Changed

-   Whole new project architecture (with new build script and code cleanup)

## [0.15.3][] - 2019-11-25

### Changed

-   Fix an infinite re-rendering case on SlideshowControls [#233](https://github.com/lumapps/design-system/pull/233)

## [0.15.2][] - 2019-11-15

### Changed

-   Use `Popover` in the `Tooltip` component

## [0.15.1][] - 2019-11-07

### Changed

-   Fix scrollbar re-appearing when `Dialog` re-renders

## [0.15.0][] - 2019-11-06

### Added

-   Uploader component [#208](https://github.com/lumapps/design-system/pull/208)

### Changed

-   Deprecated `ThumbnailAspectRatio` (use `AspectRatio` instead) [#208](https://github.com/lumapps/design-system/pull/208)

## [0.14.0][] - 2019-11-05

### Added

-   Multiple Autocomplete component [#209](https://github.com/lumapps/design-system/pull/209)
-   `isHighlighted` prop for `Chip` component [#209](https://github.com/lumapps/design-system/pull/209)
-   Added `isClearable` and `chips` props for Autocomplete [#209](https://github.com/lumapps/design-system/pull/209)

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

[0.10.0]: https://github.com/lumapps/design-system/tree/v0.10.0
[0.11.0]: https://github.com/lumapps/design-system/tree/v0.11.0
[0.12.0]: https://github.com/lumapps/design-system/tree/v0.12.0
[0.13.0]: https://github.com/lumapps/design-system/tree/v0.13.0
[0.14.0]: https://github.com/lumapps/design-system/tree/v0.14.0
[0.15.0]: https://github.com/lumapps/design-system/tree/v0.15.0
[0.15.1]: https://github.com/lumapps/design-system/tree/v0.15.1
[0.15.2]: https://github.com/lumapps/design-system/tree/v0.15.2
[0.15.3]: https://github.com/lumapps/design-system/tree/v0.15.3
[0.17.0]: https://github.com/lumapps/design-system/tree/v0.17.0
[0.18.0]: https://github.com/lumapps/design-system/tree/v0.18.0
[0.18.1]: https://github.com/lumapps/design-system/tree/v0.18.1
[0.18.2]: https://github.com/lumapps/design-system/tree/v0.18.2
[0.18.3]: https://github.com/lumapps/design-system/tree/v0.18.3
[0.18.4]: https://github.com/lumapps/design-system/tree/v0.18.4
[0.18.5]: https://github.com/lumapps/design-system/tree/v0.18.5
[0.18.6]: https://github.com/lumapps/design-system/tree/v0.18.6
[0.18.7]: https://github.com/lumapps/design-system/tree/v0.18.7
[0.18.8]: https://github.com/lumapps/design-system/tree/v0.18.8
[0.18.9]: https://github.com/lumapps/design-system/tree/v0.18.9
[0.19.0]: https://github.com/lumapps/design-system/tree/v0.19.0
[0.20.0]: https://github.com/lumapps/design-system/tree/v0.20.0
[0.20.1]: https://github.com/lumapps/design-system/tree/v0.20.1
[0.21.0]: https://github.com/lumapps/design-system/tree/v0.21.0
[0.21.1]: https://github.com/lumapps/design-system/tree/v0.21.1
[0.21.2]: https://github.com/lumapps/design-system/tree/v0.21.2
[0.21.3]: https://github.com/lumapps/design-system/tree/v0.21.3
[0.21.4]: https://github.com/lumapps/design-system/tree/v0.21.4
[0.21.5]: https://github.com/lumapps/design-system/tree/v0.21.5
[0.21.6]: https://github.com/lumapps/design-system/tree/v0.21.6
[0.21.7]: https://github.com/lumapps/design-system/tree/v0.21.7
[0.21.8]: https://github.com/lumapps/design-system/tree/v0.21.8
[0.21.9]: https://github.com/lumapps/design-system/tree/v0.21.9
[0.21.10]: https://github.com/lumapps/design-system/tree/v0.21.10
[0.21.11]: https://github.com/lumapps/design-system/tree/v0.21.11
[0.21.12]: https://github.com/lumapps/design-system/tree/v0.21.12
[0.21.13]: https://github.com/lumapps/design-system/tree/v0.21.13
[0.21.14]: https://github.com/lumapps/design-system/tree/v0.21.14
[0.21.15]: https://github.com/lumapps/design-system/tree/v0.21.15
[0.21.16]: https://github.com/lumapps/design-system/tree/v0.21.16
[0.21.17]: https://github.com/lumapps/design-system/tree/v0.21.17
[0.21.18]: https://github.com/lumapps/design-system/tree/v0.21.18
[0.21.19]: https://github.com/lumapps/design-system/tree/v0.21.19
[0.22.0]: https://github.com/lumapps/design-system/tree/v0.22.0
[0.23.0]: https://github.com/lumapps/design-system/tree/v0.23.0
[0.24.0]: https://github.com/lumapps/design-system/tree/v0.24.0
[0.24.2]: https://github.com/lumapps/design-system/tree/v0.24.2
[0.24.3]: https://github.com/lumapps/design-system/tree/v0.24.3
[0.25.0]: https://github.com/lumapps/design-system/tree/v0.25.0
[0.25.2]: https://github.com/lumapps/design-system/tree/v0.25.2
[0.25.3]: https://github.com/lumapps/design-system/tree/v0.25.3
[0.25.4]: https://github.com/lumapps/design-system/tree/v0.25.4
[0.25.5]: https://github.com/lumapps/design-system/tree/v0.25.5
[0.25.6]: https://github.com/lumapps/design-system/tree/v0.25.6
[0.25.7]: https://github.com/lumapps/design-system/tree/v0.25.7
[0.25.8]: https://github.com/lumapps/design-system/tree/v0.25.8
[0.25.9]: https://github.com/lumapps/design-system/tree/v0.25.9
[0.25.10]: https://github.com/lumapps/design-system/tree/v0.25.10
[0.25.11]: https://github.com/lumapps/design-system/tree/v0.25.11
[0.25.12]: https://github.com/lumapps/design-system/tree/v0.25.12
[0.25.13]: https://github.com/lumapps/design-system/tree/v0.25.13
[0.25.14]: https://github.com/lumapps/design-system/tree/v0.25.14
[0.25.15]: https://github.com/lumapps/design-system/tree/v0.25.15
[0.25.16]: https://github.com/lumapps/design-system/tree/v0.25.16
[0.26.0]: https://github.com/lumapps/design-system/tree/v0.26.0
[0.26.1]: https://github.com/lumapps/design-system/tree/v0.26.1
[0.26.2]: https://github.com/lumapps/design-system/tree/v0.26.2
[0.27.0]: https://github.com/lumapps/design-system/tree/v0.27.0
[0.28.0]: https://github.com/lumapps/design-system/tree/v0.28.0
[0.28.1]: https://github.com/lumapps/design-system/tree/v0.28.1
[0.28.2]: https://github.com/lumapps/design-system/tree/v0.28.2
[1.0.0]: https://github.com/lumapps/design-system/tree/v1.0.0
[1.0.1]: https://github.com/lumapps/design-system/tree/v1.0.1
[1.0.2]: https://github.com/lumapps/design-system/tree/v1.0.2
[1.0.3]: https://github.com/lumapps/design-system/tree/v1.0.3
[1.0.4]: https://github.com/lumapps/design-system/tree/v1.0.4
[1.0.5]: https://github.com/lumapps/design-system/tree/v1.0.5
[1.0.6]: https://github.com/lumapps/design-system/tree/v1.0.6
[1.0.7]: https://github.com/lumapps/design-system/tree/v1.0.7
[1.0.8]: https://github.com/lumapps/design-system/tree/v1.0.8
[1.0.9]: https://github.com/lumapps/design-system/tree/v1.0.9
[1.0.10]: https://github.com/lumapps/design-system/tree/v1.0.10
[1.0.11]: https://github.com/lumapps/design-system/tree/v1.0.11
[1.0.12]: https://github.com/lumapps/design-system/tree/v1.0.12
[1.0.13]: https://github.com/lumapps/design-system/tree/v1.0.13
[1.0.14]: https://github.com/lumapps/design-system/tree/v1.0.14
[1.0.15]: https://github.com/lumapps/design-system/tree/v1.0.15
[1.0.16]: https://github.com/lumapps/design-system/tree/v1.0.16
[1.0.17]: https://github.com/lumapps/design-system/tree/v1.0.17
[1.0.18]: https://github.com/lumapps/design-system/tree/v1.0.18
[1.0.19]: https://github.com/lumapps/design-system/tree/v1.0.19
[1.0.20]: https://github.com/lumapps/design-system/tree/v1.0.20
[1.0.21]: https://github.com/lumapps/design-system/tree/v1.0.21
[1.0.22]: https://github.com/lumapps/design-system/tree/v1.0.22
[1.0.23]: https://github.com/lumapps/design-system/tree/v1.0.23
[1.0.24]: https://github.com/lumapps/design-system/tree/v1.0.24
[2.0.0]: https://github.com/lumapps/design-system/tree/v2.0.0
[2.0.1]: https://github.com/lumapps/design-system/tree/v2.0.1
[2.0.2]: https://github.com/lumapps/design-system/tree/v2.0.2
[2.0.3]: https://github.com/lumapps/design-system/tree/v2.0.3
[2.0.4]: https://github.com/lumapps/design-system/tree/v2.0.4
[2.0.5]: https://github.com/lumapps/design-system/tree/v2.0.5
[2.1.0]: https://github.com/lumapps/design-system/tree/v2.1.0
[2.1.1]: https://github.com/lumapps/design-system/tree/v2.1.1
[2.1.2]: https://github.com/lumapps/design-system/tree/v2.1.2
[2.1.3]: https://github.com/lumapps/design-system/tree/v2.1.3
[2.1.4]: https://github.com/lumapps/design-system/tree/v2.1.4
[2.1.5]: https://github.com/lumapps/design-system/tree/v2.1.5
[unreleased]: https://github.com/lumapps/design-system/compare/v2.1.5...HEAD
[unreleased]: https://github.com/lumapps/design-system/compare/v2.1.6...HEAD
[2.1.6]: https://github.com/lumapps/design-system/tree/v2.1.6
[unreleased]: https://github.com/lumapps/design-system/compare/v2.1.7...HEAD
[2.1.7]: https://github.com/lumapps/design-system/tree/v2.1.7
[unreleased]: https://github.com/lumapps/design-system/compare/v2.1.8...HEAD
[2.1.8]: https://github.com/lumapps/design-system/tree/v2.1.8
[unreleased]: https://github.com/lumapps/design-system/compare/v2.1.9...HEAD
[2.1.9]: https://github.com/lumapps/design-system/tree/v2.1.9
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/lumapps/design-system/tree/v2.2.0
