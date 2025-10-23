# Changelog

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   `TextField`: handle `aria-disabled=true` for an accessible disabled state

### Fixed

-   `Button` and `IconButton`: fix handling `aria-disabled=true` with link button (using `href` or `linkAs`)

## [3.18.1][] - 2025-10-27

### Fixed

- `Thumbnail`: update CSS for thumbnail rendering with wrongly dimensioned images in chrome.

## [3.18.0][] - 2025-10-03

### Fixed

-   `Popover`, `Dialog` & `Lightbox`: fix close on click away across shadow DOM boundary

### Added

-   `ExpansionPanel`: added `closeMode` to `"unmount"` or `"hide"` children when the item is closed.

## [3.17.2][] - 2025-10-01

### Fixed

-   `Popover`, `Dialog` & `Lightbox`: fix close on click away inside a shadow DOM

## [3.17.1][] - 2025-09-11

### Fixed

-   `Notification`: remove unwanted `);` string in render

## [3.17.0][] - 2025-09-11

### Added

-   `@lumx/react/utils`: add `PortalProvider` to customize portal render of tooltip, popover, dialog and lightbox
-   `@lumx/react/utils`: add `Portal` to re-use the same portal render

## [3.16.0][] - 2025-09-04

### Changed

-   `@lumx/core`: rework internal build
-   `@lumx/angularjs`: rework internal build
-   `@lumx/icons`: rework internal build; internally split ESM files for each icon to improve tree-shaking

## [3.15.1][] - 2025-08-13

### Fixed

-   `Popover` & `Tooltip`: fix popper warning on margin style applied by class `.visually-hidden`.
-   `Thumbnail`: fix console warning on img overflow style.
-   Apply default props internally to have them properly work on React 19

## [3.15.0][] - 2025-07-02

### Fixed

-   `UserBlock`: fix fields wrapping in horizontal mode.
-   `Dialog`: fixed dialog `section` layout to avoid the `role=dialog` overriding the section role and breaking the link with the `header` and `footer`.

### Added

-   `ProgressCircular`: add inline display variant

## [3.14.1][] - 2025-06-02

### Fixed

-   `Thumbnail`: fix focal points equal to 0

### Changed

-   `Button`: add disabled behavior with `aria-disabled` only

## [3.14.0][] - 2025-05-13

### Fixed

-   `DatePickerField`: fix minDate and endDate behavior to be always included
-   `IconButton`: fix incorrect color when prop theme is dark and context theme is light
-   `ExpansionPanel`: fix allow content resize after opening transition

### Added

-   `Text`, `Heading`, `Icon`, `InlineList` and `Link`: can now set color and color variant directly in the `color` props (ex: `color="dark-L2"`)

### Changed

-   Docs: update `Filter and sort` pattern doc page
-   `Avatar`: add `xxs` size (to add inside chips)

## [3.13.2][] - 2025-04-10

### Fixed

-   `Link`: fix focus outline warping around nested icons
-   `Link`: fix icon alignment with nested `hasShape` icons

## [3.13.1][] - 2025-04-02

### Fixed

-   `Tab`: fix state update infinite loop on React 18

## [3.13.0][] - 2025-03-27

### Added

-   `InputLabel`: add `typography` prop
-   `Link`: add focus outline for better a11y
-   `Link`: make any nested icon adapt to the link typography

### Fixed

-   `Button`: fix icon color inside a theme context
-   `Link`: fix parent typography not correctly inherited on button-like links

### Changed

-   `Link`: deprecated `rightIcon`/`leftIcon` props (use nested icons instead)
-   `Link` docs: rework documentation page

## [3.12.0][] - 2025-03-19

### Added

-   `Dialog`, `Lightbox` & `PopoverDialog`: set default heading level context to `h2`
-   `UserBlock`: added `additionalFields` and `after` props

## [3.11.3][] - 2025-03-04

### Fixed

-   `Tooltip`: remove placement style when hidden (closeMode=hide) to fix overflow issue
-   `Mosaic`: remove negative inset that could break overflow of parent element
-   `Popover`: limit popover placement update on element resize

## [3.11.2][] - 2025-02-18

### Fixed

-   `Popover`: fix rendering on initializing that could break placement on constrained space
-   `Tooltip`: fix improper first placement on React 18

## [3.11.1][] - 2025-02-13

### Fixed

-   `IconButton`: remove the children prop as it's not actually supported by the component
-   `Popover`: fix improper first placement on React 18
-   `Popover`: update placement on both anchor and popover resize
-   `Tooltip`: remove un-necessary tooltip `aria-label` that would break `aria-labelledby` link to anchor

## [3.11.0][] - 2025-02-05

### Added

-   `ThemeProvider` & `useTheme`: add context util to facilitate propagation of theme
-   `Popover`: dark theme prop applies to all children via the theme context

## [3.10.0][] - 2025-01-16

### Changed

-   `TextField`: change theme light border color for better contrast
-   `SlideShow`: rework control button color contrast for better a11y
-   `Chip`: rework selected state style for better a11y
-   `Navigation`: rework selected state style for better a11y
-   `SideNavigationItem`: rework selected state style for better a11y
-   `Button`: rework selected state style for better a11y

## [3.9.8][] - 2025-01-10

### Fixed

-   `Tabs`: removed (revert) a problematic flex-grow style on the tablist.

## [3.9.7][] - 2025-01-07

### Changed

-   `Tabs`: add tab label truncate on constrained width.

## [3.9.6][] - 2024-12-04

### Added

-   `Button`: add support of `isSelected` in `low` emphasis (in addition to `medium`).

### Changed

-   `DatePicker`: update day buttons to use standard button styles
-   `Chip`: add border and background color CSS variable theming on selected state.
-   `SideNavigationItem`: add border CSS variable theming on selected state.
-   `Button`: deprecated variables `--lumx-button-emphasis-selected-state-default-padding-horizontal`,
    `--lumx-button-emphasis-selected-hover-hover-padding-horizontal` and
    `--lumx-button-emphasis-selected-hover-active-padding-horizontal` (use the base `low` or `medium` emphasis padding)

### Fixed

-   `NavigationItem`: fix focus outline in dark theme
-   `NavigationSection`: fix props forwarding
-   `NavigationItem`: fix border left & right impacting the width

### Documentation

-   Storybook dark theme switcher: improve label of dark/light modes
-   Storybook `withCombinations()`: better section heading, exclude combinations
-   Storybook `withTheming()`: new decorator to demonstrate CSS variables on stories
-   Storybook `Button`:
    -   Cleaned up stories argTypes and controls
    -   Rework stories content with more combinations
    -   Add theming story
-   Storybook `DatePicker`: add theming story
-   Storybook `Chip`: add theming story
-   Storybook `Navigation`: add variants & theming stories
-   Storybook `SideNavigationItem`: add variant and theming stories

## [3.9.5][] - 2024-11-06

### Fixed

-   `Chip`: trigger onClick when `Enter` key is pressed
-   `ExpansionPanel`: fix children remaining in the DOM when `isOpen` prop changes

## [3.9.4][] - 2024-11-04

### Fixed

-   `ExpansionPanel`: fix children remaining in the DOM when closed
-   `ImageLightbox`: fix unexpected error on windows 10 reporting incorrect touch device

### Added

-   `BadgeWrapper`: add this new component to allow adding a badge to any component.

### Changed

-   `Mosaic`: removed broken lightboxes on mosaic demos.

## [3.9.3][] - 2024-10-09

### Fixed

-   `ImageLightbox`: fix closing transition triggering multiple times.

### Changed

-   `Tooltip`: use the standard class `visually-hidden` when closed and with `closeMode="hide"`.

## [3.9.2][] - 2024-10-04

### Fixed

-   `Slideshow`: changed active pagination item width for better a11y.
-   `ImageLightbox`: fix closing animation cut short because of unstable image reference.

### Added

-   `Tooltip`: add `closeMode` to hide the tooltip instead of unmounting it.
-   `Tooltip`: add `ariaLinkMode` to use tooltip as label instead of description.

### Changed

-   `Tooltip`: increment z-index making them appear above popovers.
-   `TextField`: display browser native buttons when used with type="number", add "number" use case documentation.
-   `TextField`: add jsdoc and typing for `type` prop.

## [3.9.1][] - 2024-09-17

### Fixed

-   `Tooltip`: fix re-render errors when removing the label.
-   `useImageLightbox`: update props each time the lightbox opens.
-   `ImageLightbox`: fix reset zoom scale when switching to the first item.
-   `ButtonGroup`: fixed border radius style with single button or `.visually-hidden` children.
-   `ImageLightbox`: fix zoom center based on mouse position on mouse wheel zoom.

## [3.9.0][] - 2024-09-03

### Added

-   `ImageLightbox`: new component providing an image slideshow lightbox with extra features (zoom & a11y).
-   `UserBlock`: added an XS size.

### Changed

-   `DatePicker`: improve display of localized day number.
-   Reworked internal id generation (linking fields with labels, a11y attributes). Removed the `uid` dependency.
-   `Message`: changed type "info" color to blue
-   `Notification`: changed type "info" color to blue

## [3.8.1][] - 2024-08-14

### Fixed

-   `ImageBlock`: restore old caption class names.

### Changed

-   `ImageBlock`: add `titleProps` and `descriptionProps` to forward to the title and description.

## [3.8.0][] - 2024-08-13

### Fixed

-   `Lightbox`: fix a11y color contrast on the close button.
-   `Mosaic`: fix thumbnail focus outline cropped by parent overflow.
-   `SlideShow`: fix pagination item focus outline cropped by parent overflow.

### Changed

-   `Heading`: fix the default typography when the `as` prop is set.
-   `ImageBlock`: internal changes on caption styles (simply and make reusable).

### Added

-   `Thumbnail`: add `loadingPlaceholderImageRef` to re-use a loaded image as the loading placeholder.
-   `Checkbox`: add intermediate state via `isChecked="intermediate"`

## [3.7.5][] - 2024-07-25

### Changed

-   `ListItem`: display keyboard focus ring even when not highlighted
-   `Message`: changed spacing between icon and text from 16 to 8

## [3.7.4][] - 2024-06-20

### Fixed

-   `GenericBlock`: fix shrinking content with `min-width: 0`.

## [3.7.3][] - 2024-06-19

### Fixed

-   `Chip`: fix forward key down event on clickable chip
-   `TextField`: fix forward aria-describedby prop to input

### Changed

-   `Select`, `SelectMultiple`: add `selectElementRef` prop to reference the actual input field of these components.

## [3.7.2][] - 2024-05-22

### Fixed

-   Tooltip: fix children not having consistent ref on re-render (like when updating the tooltip label)

## [3.7.1][] - 2024-05-21

### Fixed

-   `@lumx/core`: lumx-color-variant, add fallback to default variant

### Added

-   InlineList: add `wrap` prop to activate line wrap on overflow
-   Thumbnail: add `objectFit` prop to control how the image fit in a constrained aspect ratio.
    Defaults to `cover` to scale & crop the image (like before).
    Can be changed to `contain` to avoid cropping the image (aka letterboxing).
-   Flag: add `truncate` prop to activate text ellipsis on overflow.
-   Text: add `title` attribute when text is overflowing to display the full text on mouse over.

### Changed

-   Flag: allow any react node in label.

## [3.7.0][] - 2024-04-29

### Added

-   `@lumx/icons`: added icons TikTok, TencentQQ, TencentVideo and Baidu

### Changed

-   `@lumx/icons`: optimized all JS SVG path icons (23% reduction in size)
-   `@lumx/icons`: removed `@mdi/js` dependency, icons are copied in the library (necessary for the optimization)

## [3.6.8][] - 2024-04-18

### Fixed

-   Chip: fix chip not receives focus when used as link
-   Chip: Make it possible to override the following props: `role`, `tabIndex`

### Changed

-   DatePicker: force a constant number of rows in the month calendar to avoid layout shift

## [3.6.7][] - 2024-04-02

### Fixed

-   `@lumx/core`: fix customization of selected button CSS variables
-   `@lumx/core`: red/D2, red/N and green/N colors to fix color contrast a11y

### Added

-   DatePicker: add an input to change the displayed year
-   Message: add a `closeButtonProps` prop to add a close button in the message. Only available for `info` kind messages with a background.
-   Popover: add a `focusTrapZoneElement` prop to specify the element in which the focus trap should be applied.

### Changed

-   Dialog: fullscreen display on smaller viewport

## [3.6.6][] - 2024-03-15

### Fixed

-   Thumbnail: use `span` instead of `div` in children elements to avoid semantic error on clickable thumbnails (button).
-   PopoverDialog: fix the `aria-label` prop not properly forwarded to the dialog.
-   ChipGroup: fix unwanted extra negative margin around chips (deprecating the `align` prop)

### Added

-   `@lumx/core`: add `.visually-hidden` a11y helper class to use on elements that should be read by screen readers but not shown.
-   DatePicker: improve screen reader text
-   TextField: add `labelProps` prop to forward to the label element
-   DatePickerField: improve date picker dialog a11y

## [3.6.5][] - 2024-02-21

### Fixed

-   Tooltip: avoid removing the anchor `aria-describedby`
-   Popover: unstable restore focus and changing anchor refs (triggered by anchor wrapped in tooltip)

### Changed

-   Autocomplete: forward `focusAnchorOnClose` prop

## [3.6.4][] - 2024-02-20

### Fixed

-   InputHelper: change of html tag to improve semantic
-   Popover: restore focus on trigger on closed externally

### Changed

-   Tooltip: do not show on anchor focus if the focus is not visible (keyboard driven)

## [3.6.3][] - 2024-02-08

### Fixed

-   Thumbnail: fix warnings on image overflow style
-   Notification: fix forwarding style

### Added

-   Popover: add dark theme

### Changed

-   Popover: reworked arrow style to be bigger and with a correct drop shadow
-   Notification: add `usePortal` (default value is `true`) to be able to not use a portal in some cases.

## [3.6.2][] - 2024-01-16

### Fixed

-   Lightbox, Dialog, Notification: fix remove from DOM when closing while the opening transition isn't finished.
-   Avatar: fixed Chrome behavior when down-scaling avatar so it is not pixelated anymore

## [3.6.1][] - 2024-01-05

### Added

-   Text: add style customisation with `whiteSpace` props
-   Add new design token `medium` for `font-weight`.

### Fixed

-   Tooltip: fixed tooltip closing when mouse is hovering the tooltip text.
-   Tooltip: fixed close on Escape key pressed (not only when anchor is focused).
-   Lightbox: fixed aria dialog accessibility (reworked role, labelling and default focus element).
-   Lightbox: document accessibility concerns.

## [3.6.0][] - 2023-12-05

### Changed

-   `@lumx/icons`: override & alias system in place. now custom icon fonts are now generated from MDI fonts we extend.
-   `@lumx/icons`: override Twitter logo to use the new X logo.
-   `@lumx/core`: make component spacing styles default to CSS variables.
-   `@lumx/core`: make component border styles default to CSS variables.
-   `@lumx/core`: change text-field background to transparent.
-   `@lumx/core`: minor change on tabs color.
-   `@lumx/core`: minor change on navigation colors.
-   `@lumx/core`: minor change on button colors.

## [3.5.5][] - 2023-11-13

### Changed

-   Table row: selected states color update + documentation update
-   `@lumx/core`: remove default line-height on custom title typography.

## [3.5.4][] - 2023-10-17

### Changed

-   List & Navigation: add outline on focus-visible for better accessibility
-   `@lumx/react` no long depend on `moment` or `moment-range` to generate the date picker.
-   Deprecated `@lumx/core/js/date-picker` functions that **will be removed in the next major version** along with `moment` and `moment-range`.
-   DatePicker & DatePickerField: `locale` prop is now optional (uses browser locale by default)
-   ListSubHeader: darken text color for better accessibility

## [3.5.3][] - 2023-08-30

### Changed

-   Upgrade dependency `classnames` to v2.3.2

## [3.5.2][] - 2023-08-08

### Fixed

-   Thumbnail: remove undesired console log.

## [3.5.1][] - 2023-08-02

### Changed

-   Thumbnail: synchronously set error for image with empty source.

## [3.5.0][] - 2023-07-27

### Added

-   Tab: add icon customisation with `iconProps`

### Fixed

-   Thumbnail: fix an issue with SVG images not loading on firefox when no width/height is specified.

## [3.4.0][] - 2023-07-06

### Changed

-   CommentBlock: `name` & `date` are now optional
-   CommentBlock: `onClick`, `onMouseEnter` & `onMouseLeave` are now deprecated
-   Thumbnail: reworked image sizing with native CSS aspect ratio if supported

### Added

-   Thumbnail: added `panoramic` aspect ratio

### Fixed

-   TableCell: fix clickable & sortable header cell accessibility
-   Uploader: use button element by default
-   Uploader: use label and input file elements when providing `fileInputProps`
-   Autocomplete: fix focus field when clear button is triggered
-   SideNavigationItem: fix closed/opened state accessibility
-   SideNavigationItem: use button element by default for better accessibility

## [3.3.1][] - 2023-06-12

### Fixed

-   IconButton: remove the `aria-describedby` attribute when the `aria-label` and the `aria-describedby` have the same value.
-   TextField: focus the text field input when clicking on the clear button

## [3.3.0][] - 2023-05-03

### Added

-   `TextField` component now shows `aria-describedby` and `aria-invalid` attributes.
-   `TextField` component now has a new prop `onClear` to allow a callback to be passed.

## [3.2.1][] - 2023-04-26

### Fixed

-   Select: fix the select dropdown focus not being trapped in it.
-   Popover, DatePickerField, Dialog & Lightbox: remove unnecessary scroll on open (on focus trap activation)
-   Popover & Dropdown: remove unnecessary scroll on close (on focus restore)

## [3.2.0][] - 2023-04-11

### Changed

-   @lumx/core: improved color contrast on dark L6 & L2

### Added

-   New `Navigation` component.

## [3.1.5][] - 2023-02-03

### Added

-   Dialog: added new props `disableBodyScroll`, `preventCloseOnClick` and `preventCloseOnEscape`

## [3.1.4][] - 2023-01-26

### Changed

-   Popover: skip positioning logic in jsdom environment (can only be tested in integration tests).
-   Popover: add `as` prop to customize the root element component render.

## [3.1.3][] - 2023-01-12

### Added

-   ExpansionPanel: passed event to the `onOpen`, `onClose` and `onToggleOpen` callbacks.

### Fixed

-   GridColumn: fix SCSS variable interpolation.

## [3.1.2][] - 2023-01-05

### Added

-   New `GridColumn` component.
-   Progress: split into `ProgressCircular` and `ProgressLinear` components. `Progress` is now deprecated.
-   ProgressCircular: add `size` variants.

### Changed

-   Badge, Button, Chip, Icon, Link: only `ColorPalette` values are allowed on the `color` prop (instead of `string`). **This has no impact on functionality**, if you used unsupported color before, you can ignore TS errors with `as any`.

### Fixed

-   Tab: fix disabled state.

## [3.0.7][] - 2022-12-06

### Added

-   Checkbox: add `disabled` attribute to the `input` element

## [3.0.6][] - 2022-12-01

### Added

-   New component in React: `PopoverDialog`.
-   New type : `HasAriaLabelOrLabelledBy`
-   Popover: add `withFocusTrap` prop to set a focus trap within the popover.

### Fixed

-   Autocomplete: fix type of textFieldProps prop.

### Changed

-   Popover, Dropdown, Autocomplete: add `minWidth`, `maxWidth` and `width` options to the `fitToAnchorWidth` property.
-   Button: make Text component's truncate work with Button

## [3.0.5][] - 2022-11-21

### Added

-   RadioButton: add `inputProps` prop to forward to the native input element.

### Fixed

-   RadioButton: fix helper text accessibility
-   Switch: fix helper text accessibility
-   ExpansionPanel: fix toggle button a11y using the disclosure pattern.

### Changed

-   Dialog, LightBox, Notification: rework DOM unmount to be based on CSS opacity transition instead of a timeout. **This change can break unit test if you previously relied on the timeout**.

## [3.0.4][] - 2022-11-07

### Added

-   Autocomplete: add `textFieldProps` props to the autocomplete component.

### Fixed

-   InlineList: Set `listitem` role to items since `display: contents` attribute removes the semantics.
-   Text: ignore empty children to make `dangerouslySetInnerHTML` work as expected.

### Changed

-   `@lumx/core` a11y: Introducing a more visible outline on elements with keyboard focus.
-   `@lumx/react`: rework how TS types are exposed. Fixed types for `List.useKeyboardListNavigation` hook.

## [3.0.3][] - 2022-10-14

### Added

-   FlexBox: add `as` prop to customize the root element component render.
-   GenericBlock: add `as` prop to customize the root, the figure, the content and actions elements component render.
-   New `ClickAwayProvider` utility component (exported in the new `@lumx/react/utils` module).
-   New `InlineList` component.

### Changed

-   Text: improve icon alignment inside text.
-   Text: add `noWrap` prop to disable line wrap.

## [3.0.2][] - 2022-09-23

### Added

-   New `Text` component.
-   New `Heading` component. The component comes with a `HeadingProvider` that allows the `Heading` component to automatically use the correct heading level depending on the nested providers.
-   New `useHeadingLevel` hook to get the current heading level.
-   FlexBox: new options added for `vAlign` and `hAlign` props (`space-between`, `space-evenly` and `space-around`).

### Changed

-   Slideshow: Improve accessibility by adding `tablist` / `tab` roles to slideshow pagination and `tabpanel` role to slide groups. These elements are linked together using `aria-controls` attribute.
-   Slideshow: Added the `slideGroupLabel` prop to set a label on each slide groups. The prop should be a function that receives the group position starting from 1 and the total number of groups.
-   Slideshow: Slides grouped together are now wrapper inside individual divs.
-   SlideshowControls: Added the `paginationItemProps` prop to set custom props to each pagination item. The prop should be a function that receives the item index.
-   SlideshowControls: The bullets now use the "roving tab index" pattern to have only the current slide focusable and navigate using the left/right arrows.

### Fixed

-   Slideshow: Avoid slides that are not displayed to be focusable and read by a screen reader.

## [3.0.1][] - 2022-09-21

### Changed

-   `@lumx/core`: _[BREAKING]_ migrating from `node-sass` v4.13.1 to `sass` v1.54.0.
    All SASS depreciation warnings have been handled, LumX is ready for SASS v2+.
    You must do the migration too if you are using `@lumx/core` SCSS stylesheets.
-   `@lumx/core`: update `sass-mq` from v5 to v6.

## [2.2.25][] - 2022-08-04

### Changed

-   @lumx/icons: provide both CJS and ESM module for better tooling compatibility.

## [2.2.24][] - 2022-08-02

### Fixed

-   Thumbnail: fix a bug on focus shift calculation caused when focusPoint is equals to 0 and the scaled image size equals the container size.

## [2.2.23][] - 2022-08-01

### Changed

-   GenericBlock: improve default props values:
    -   `orientation` defaults to `horizontal`
    -   `vAlign` & `hAlign` do not default to anything
    -   `vAlign` & `hAlign` of "figure", "content" and "actions" sections default to the root `vAlign` & `hAlign` props
    -   `gap` defaults to `big`
-   GenericBlock: remove sections ("figure", "content" and "actions") if empty.
-   GenericBlock: prevent overflow by default.
-   FlexBox: add `tiny` to the possible `gap` sizes.
-   @lumx/icons: inline mdi icon import in the ESM module for better tree shaking.
-   @lumx/react: fix `TypographyCustom` values.
-   Link: allow using all typography variants.

### Fixed

-   Thumbnail: fix a bug on focus shift calculation caused when focusPoint is equals to 0 and the image size equals the container size.

## [2.2.22][] - 2022-07-25

### Changed

-   Thumbnail: broaden `badge` prop TS type from `ReactElement` to `ReactElement | Falsy`.
-   Dialog: broaden `contentRef` prop TS type from `RefObject` to `Ref`.
-   TextField: broaden `inputRef` prop TS type from `RefObject` to `Ref`.
-   Autocomplete: broaden `inputRef` prop TS type from `RefObject` to `Ref`.

### Fixed

-   Dialog: avoid closing all nested dialogs if the user clicks outside a children dialog.

### Added

-   GenericBlock: added alternative API to specify the "figure", "content" and "actions" sections using components.

## [2.2.21][] - 2022-07-04

### Fixed

-   @lumx/react build: fix export of react types in component props
-   Dialog & Lightbox: fixed focus trap containing hidden input.

## [2.2.20][] - 2022-07-01

### Added

-   LinkPreview: added `linkAs` prop to customize link component.
-   LinkPreview: added `titleHeading` prop to customize the title heading tag.
-   Select & SelectMultiple: add `icon` props
-   New `GenericBlock` component
-   Popover: focus first focusable element in anchor OR anchor on close.

### Fixed

-   LinkPreview: Improve accessibility on thumbnail link, remove redundant links in focus order and improve tag semantics.
-   Dialog & Lightbox: fixed focus trap not working when closing and reopening the same component.
-   Dialog & Lightbox & DatePickerField: fixed focus trap on nested components.
-   Dialog & Lightbox & Popover: fixed 'Escape' key to close nested components.
-   DatePickerField: fix focus element when opened and re-opened.

## [2.2.19][] - 2022-06-03

### Fixed

-   UserBlock a11y: remove avatar keyboard focus to avoid the redundant keyboard navigation with the name element.
-   Dialog & Lightbox: fixed focus trap on `disabled=false` elements.

## [2.2.18][] - 2022-05-20

### Fixed

-   Tooltip: clear pending timers when the component unmounts

### Added

-   SideNavigationItem: added `closeMode` to `"unmount"` or `"hide"` children when the item is closed.

## [2.2.17][] - 2022-04-28

### Fixed

-   Dialog & Lightbox: fixed focus trap on disabled elements and protect against focus breaking out.

### Added

-   Size map: added `medium`
-   FlexBox: added gap size `medium`

## [2.2.16][] - 2022-04-20

### Added

-   Added forwarded props to the `SelectMultiple` component.

## [2.2.15][] - 2022-04-14

### Fixed

-   Thumbnail: fix css display when thumbnails are fill-height & clickable.

## [2.2.14][] - 2022-04-13

### Added

-   RadioButton: Added `inputRef` prop to forward a ref on the native input.
-   Checkbox: Added `inputRef` prop to forward a ref on the native input.

### Changed

-   @lumx/core: all CSS animations and transitions are now disabled on browsers with `prefers-reduced-motion` media feature enabled.

### Fixed

-   Mosaic: fix mosaic thumbnail not appearing on safari when providing a `onImageClik` prop.

## [2.2.13][] - 2022-04-08

### Added

-   CommentBlock: Added `fullDate` prop displaying when hovering the date with the mouse;

### Changed

-   CommentBlock: Move the comment date to below comment text;

### Fixed

-   Select: fix chip vertical margin calculation.

## [2.2.12][] - 2022-03-24

### Added

-   Popover: Added `focusAnchorOnClose` prop to reset the focus back to the anchor element when popover closes and focus is set within. Default to `true`;
-   Dropdown: Added `focusAnchorOnClose` prop to reset the focus back to the anchor element when popover closes and focus is set within. Default to `true`;
-   List: Added `tabIndex` prop to control the list tabIndex. Default to `-1` to avoid breaking changes.

### Fixed

-   Icon: better `dark` theme on icon with shape.
-   List: Removed default `tabIndex={0}`.
-   Tooltip: Removed unecessary set state on unmount causing warnings in React dev tools.

## [2.2.11][] - 2022-03-17

### Fixed

-   Slideshow: temporarily remove slide `visibility: hidden`.

## [2.2.10][] - 2022-03-16

### Added

-   Slideshow Controls: Added Play/Pause Button and added focus styles to bullets. Allow to pass in a label for each bullet.

### Fixed

-   Slideshow: slides no longer appear as blank while transitioning.

## [2.2.9][] - 2022-03-15

_Failed released_

## [2.2.8][] - 2022-03-10

### Added

-   Icon: Add `alt` attribute to set an alternative text to the icon. If defined, `role="img"` will also be applied to `svg` element.
    If undefined, `aria-hidden=true` will be applied to `svg` element.

### Changed

-   @lumx/core: all CSS `:hover` style are now disable on devices that do not support pointer hover.
    **warning**: this is not applied on the SCSS, use the postcss plugin `postcss-hover-media-feature` to reproduce this in your project.
-   Tooltip: rework of the activation method to fit more devices
    -   On device with touch screen:
        -   The Tooltip shows when the tooltip's anchor is pressed for more than 250 ms (long press).
            This disables the default anchor's `click`/`touchend` event.
        -   The tooltip hides 3 seconds after the long press is ended.
        -   The tooltip is not activated on a short `click`/`tap`.
    -   On devices supporting pointer hovering:
        -   The tooltip shows when hovering (500 ms delay).
        -   The tooltip hides when moving the pointer outside the anchor or clicking the anchor.
    -   On every device:
        -   The tooltip shows when focusing the anchor.
        -   The tooltip hides when loosing focus on the anchor.
        -   The tooltip hides when the escape key is pressed.
-   Slideshow: improve aria labels and make controls focusable.
-   Hooks: created hooks `useFocusWithin` and `useSlideshowControls`.

### Fixed

-   Thumbnail: className is now correctly passed from `imgProps` into the `img` tag

## [2.2.7][] - 2022-03-09

_Failed released_

## [2.2.6][] - 2022-03-02

### Changed

-   Colors: SCSS primary & secondary colors now use the CSS variables

## [2.2.5][] - 2022-02-24

### Changed

-   Colors: Blue, green, yellow and red palettes have been modified to match our accessibility standards.
-   Icon: Make sure to use dark/L1 color variant on yellow components (except for mdiAlertCircle icon).

## [2.2.4][] - 2022-02-23

### Fixed

-   Thumbnail: fix image original aspect ratio on ios safari.

## [2.2.3][] - 2022-02-07

### Added

-   Switch: Added a `inputProps` prop which will be passed to the input tag inside the Switch
-   Checkbox: Added a `inputProps` prop which will be passed to the input tag inside the Checkbox

## [2.2.2][] - 2022-01-27

### Fixed

-   UserBlock: fix button onClick not applied.

## [2.2.1][] - 2022-01-25

## Added

-   Avatar: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child.
-   UserBlock: Added a `linkProps` and `linkAs` props which will be passed to the Thumbnail child and used to wrap the username.
-   UserBlock: Added a `nameProps` props which will be passed to the name block.
-   Thumbnail: better defaults for `type` and `aria-Label` attributes when used as a button.

### Fixed

-   Fixed Tooltip with target element using a function ref instead of object ref.
-   Thumbnail: fix smaller image than the `size` prop.

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
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.1...HEAD
[2.2.1]: https://github.com/lumapps/design-system/tree/v2.2.1
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.2...HEAD
[2.2.2]: https://github.com/lumapps/design-system/tree/v2.2.2
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.3...HEAD
[2.2.3]: https://github.com/lumapps/design-system/tree/v2.2.3
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.4...HEAD
[2.2.4]: https://github.com/lumapps/design-system/tree/v2.2.4
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.5...HEAD
[2.2.5]: https://github.com/lumapps/design-system/tree/v2.2.5
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.6...HEAD
[2.2.6]: https://github.com/lumapps/design-system/tree/v2.2.6
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.7...HEAD
[2.2.7]: https://github.com/lumapps/design-system/tree/v2.2.7
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.8...HEAD
[2.2.8]: https://github.com/lumapps/design-system/tree/v2.2.8
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.9...HEAD
[2.2.9]: https://github.com/lumapps/design-system/tree/v2.2.9
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.10...HEAD
[2.2.10]: https://github.com/lumapps/design-system/tree/v2.2.10
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.11...HEAD
[2.2.11]: https://github.com/lumapps/design-system/tree/v2.2.11
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.12...HEAD
[2.2.12]: https://github.com/lumapps/design-system/tree/v2.2.12
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.13...HEAD
[2.2.13]: https://github.com/lumapps/design-system/tree/v2.2.13
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.14...HEAD
[2.2.14]: https://github.com/lumapps/design-system/tree/v2.2.14
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.15...HEAD
[2.2.15]: https://github.com/lumapps/design-system/tree/v2.2.15
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.16...HEAD
[2.2.16]: https://github.com/lumapps/design-system/tree/v2.2.16
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.17...HEAD
[2.2.17]: https://github.com/lumapps/design-system/tree/v2.2.17
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.18...HEAD
[2.2.18]: https://github.com/lumapps/design-system/tree/v2.2.18
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.19...HEAD
[2.2.19]: https://github.com/lumapps/design-system/tree/v2.2.19
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.20...HEAD
[2.2.20]: https://github.com/lumapps/design-system/tree/v2.2.20
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.21...HEAD
[2.2.21]: https://github.com/lumapps/design-system/tree/v2.2.21
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.22...HEAD
[2.2.22]: https://github.com/lumapps/design-system/tree/v2.2.22
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.23...HEAD
[2.2.23]: https://github.com/lumapps/design-system/tree/v2.2.23
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.24...HEAD
[2.2.24]: https://github.com/lumapps/design-system/tree/v2.2.24
[unreleased]: https://github.com/lumapps/design-system/compare/v2.2.25...HEAD
[2.2.25]: https://github.com/lumapps/design-system/tree/v2.2.25
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.1...HEAD
[3.0.1]: https://github.com/lumapps/design-system/tree/v3.0.1
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.2...HEAD
[3.0.2]: https://github.com/lumapps/design-system/tree/v3.0.2
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.3...HEAD
[3.0.3]: https://github.com/lumapps/design-system/tree/v3.0.3
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.4...HEAD
[3.0.4]: https://github.com/lumapps/design-system/tree/v3.0.4
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.5...HEAD
[3.0.5]: https://github.com/lumapps/design-system/tree/v3.0.5
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.6...HEAD
[3.0.6]: https://github.com/lumapps/design-system/tree/v3.0.6
[unreleased]: https://github.com/lumapps/design-system/compare/v3.0.7...HEAD
[3.0.7]: https://github.com/lumapps/design-system/tree/v3.0.7
[unreleased]: https://github.com/lumapps/design-system/compare/v3.1.2...HEAD
[3.1.2]: https://github.com/lumapps/design-system/tree/v3.1.2
[unreleased]: https://github.com/lumapps/design-system/compare/v3.1.3...HEAD
[3.1.3]: https://github.com/lumapps/design-system/tree/v3.1.3
[unreleased]: https://github.com/lumapps/design-system/compare/v3.1.5...HEAD
[3.1.5]: https://github.com/lumapps/design-system/compare/v3.1.4...v3.1.5
[3.1.4]: https://github.com/lumapps/design-system/tree/v3.1.4
[unreleased]: https://github.com/lumapps/design-system/compare/v3.2.1...HEAD
[3.2.1]: https://github.com/lumapps/design-system/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/lumapps/design-system/tree/v3.2.0
[unreleased]: https://github.com/lumapps/design-system/compare/v3.3.1...HEAD
[3.3.1]: https://github.com/lumapps/design-system/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/lumapps/design-system/tree/v3.3.0
[unreleased]: https://github.com/lumapps/design-system/compare/v3.4.0...HEAD
[3.4.0]: https://github.com/lumapps/design-system/tree/v3.4.0
[unreleased]: https://github.com/lumapps/design-system/compare/v3.5.0...HEAD
[3.5.0]: https://github.com/lumapps/design-system/tree/v3.5.0
[unreleased]: https://github.com/lumapps/design-system/compare/v3.5.1...HEAD
[3.5.1]: https://github.com/lumapps/design-system/tree/v3.5.1
[unreleased]: https://github.com/lumapps/design-system/compare/v3.5.3...HEAD
[3.5.3]: https://github.com/lumapps/design-system/compare/v3.5.2...v3.5.3
[3.5.2]: https://github.com/lumapps/design-system/tree/v3.5.2
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.0...HEAD
[3.6.0]: https://github.com/lumapps/design-system/compare/v3.5.5...v3.6.0
[3.5.5]: https://github.com/lumapps/design-system/compare/v3.5.4...v3.5.5
[3.5.4]: https://github.com/lumapps/design-system/tree/v3.5.4
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.1...HEAD
[3.6.1]: https://github.com/lumapps/design-system/tree/v3.6.1
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.2...HEAD
[3.6.2]: https://github.com/lumapps/design-system/tree/v3.6.2
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.3...HEAD
[3.6.3]: https://github.com/lumapps/design-system/tree/v3.6.3
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.4...HEAD
[3.6.4]: https://github.com/lumapps/design-system/tree/v3.6.4
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.5...HEAD
[3.6.5]: https://github.com/lumapps/design-system/tree/v3.6.5
[unreleased]: https://github.com/lumapps/design-system/compare/v3.6.6...HEAD
[3.6.6]: https://github.com/lumapps/design-system/tree/v3.6.6
[unreleased]: https://github.com/lumapps/design-system/compare/v3.7.0...HEAD
[3.7.0]: https://github.com/lumapps/design-system/compare/v3.6.8...v3.7.0
[3.6.8]: https://github.com/lumapps/design-system/compare/v3.6.7...v3.6.8
[3.6.7]: https://github.com/lumapps/design-system/tree/v3.6.7
[Unreleased]: https://github.com/lumapps/design-system/compare/3.18.1...HEAD
[3.18.1]: https://github.com/lumapps/design-system/compare/3.18.0...3.18.1
[3.18.0]: https://github.com/lumapps/design-system/compare/3.17.2...3.18.0
[3.17.2]: https://github.com/lumapps/design-system/compare/3.17.1...3.17.2
[3.17.1]: https://github.com/lumapps/design-system/compare/3.17.0...3.17.1
[3.17.0]: https://github.com/lumapps/design-system/compare/3.16.0...3.17.0
[3.16.0]: https://github.com/lumapps/design-system/compare/v3.15.1...3.16.0
[3.15.1]: https://github.com/lumapps/design-system/compare/v3.15.0...v3.15.1
[3.15.0]: https://github.com/lumapps/design-system/compare/v3.14.1...v3.15.0
[3.14.1]: https://github.com/lumapps/design-system/compare/v3.14.0...v3.14.1
[3.14.0]: https://github.com/lumapps/design-system/compare/v3.13.2...v3.14.0
[3.13.2]: https://github.com/lumapps/design-system/compare/v3.13.1...v3.13.2
[3.13.1]: https://github.com/lumapps/design-system/compare/v3.13.0...v3.13.1
[3.13.0]: https://github.com/lumapps/design-system/compare/v3.12.0...v3.13.0
[3.12.0]: https://github.com/lumapps/design-system/compare/v3.11.3...v3.12.0
[3.11.3]: https://github.com/lumapps/design-system/compare/v3.11.2...v3.11.3
[3.11.2]: https://github.com/lumapps/design-system/compare/v3.11.1...v3.11.2
[3.11.1]: https://github.com/lumapps/design-system/compare/v3.11.0...v3.11.1
[3.11.0]: https://github.com/lumapps/design-system/compare/v3.10.0...v3.11.0
[3.10.0]: https://github.com/lumapps/design-system/compare/v3.9.8...v3.10.0
[3.9.8]: https://github.com/lumapps/design-system/compare/v3.9.7...v3.9.8
[3.9.7]: https://github.com/lumapps/design-system/compare/v3.9.6...v3.9.7
[3.9.6]: https://github.com/lumapps/design-system/compare/v3.9.5...v3.9.6
[3.9.5]: https://github.com/lumapps/design-system/compare/v3.9.4...v3.9.5
[3.9.4]: https://github.com/lumapps/design-system/compare/v3.9.3...v3.9.4
[3.9.3]: https://github.com/lumapps/design-system/compare/v3.9.2...v3.9.3
[3.9.2]: https://github.com/lumapps/design-system/compare/v3.9.1...v3.9.2
[3.9.1]: https://github.com/lumapps/design-system/compare/v3.9.0...v3.9.1
[3.9.0]: https://github.com/lumapps/design-system/compare/v3.8.1...v3.9.0
[3.8.1]: https://github.com/lumapps/design-system/compare/v3.8.0...v3.8.1
[3.8.0]: https://github.com/lumapps/design-system/compare/v3.7.5...v3.8.0
[3.7.5]: https://github.com/lumapps/design-system/compare/v3.7.4...v3.7.5
[3.7.4]: https://github.com/lumapps/design-system/compare/v3.7.3...v3.7.4
[3.7.3]: https://github.com/lumapps/design-system/compare/v3.7.2...v3.7.3
[3.7.2]: https://github.com/lumapps/design-system/compare/v3.7.1...v3.7.2
[3.7.1]: https://github.com/lumapps/design-system/tree/v3.7.1
