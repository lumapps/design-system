# @lumx/icons

LumApps Design System icon library based on Material Design Icons (`@mdi/js` and `@mdi/font`) version 5 with backward
compatibility with version 4 and with some icon overrides and added icons.

There is two ways to use the icons:

1. Import SVG path from JS (ex: `import { mdiHeart } from '@lumx/icons';`) which you can display with the `Icon` react
   component (ex: `import { Icon } from '@lumx/react'; <Icon icon={mdiHeart} />`)
2. Import the SCSS style (ex: `@import '@lumx/icons/font';`) and use MDI classes (ex: `.mdi .mdi-heart`)

**Warning**: The SCSS/Font icons will get deprecated in the future as they force you to import all icons even if you
only use a few.

## Overrides & aliases

While we are based on MDI, we have overrides of both the JS and font icons handles in `override` dir:

- `override/override-icons`: contains SVG icons and config to override MDI
- `override/alias-icons.js`: config contains mapping from icon name to aliases
- `override/generate/run-all.js`: script that generate the TS & Font/SCSS overrides and then TS & Font/SCSS aliases

Aliases have been used to keep retro-compatibility when [migrating from MDI v4 to v5](./README-v4-to-v5-migration.md)
and for brand renaming (ex: twitter). Overrides helped us update or restore brand logo because MDI is deprecating them.

### Overrides

To add or replace an icons in MDI:

1. Add the SVG icon in `override/override-icons` and make sure they are defined with a single svg path in a view box at
   24/24dp and follows the MDI icons guidelines (3dp margin around the edge)
2. Add the configuration of the icon in `override/override-icons/config.json`. Set the `unicode` to know where to place
   the icon in the font (at which code point) and set `replace: '<name>'` if you want the icon to replace an existing MDI
   icon. (If you don't set it to true on existing icon, you'll get the error: `Error: Repeat unicode...`)
3. Run the `yarn generate:icons` script to re-generate
4. Validate the changes & commit them

### Aliases

To add an alias for an icon:

1. Edit the `override/alias-icons.js` config putting the original icon name in key and the aliases in value.
2. Run the `yarn generate:icons` script to re-generate
3. Validate the changes & commit them

### Preview & Test

To display all the CSS font icons, you can run `yarn test:css-font` which will generate a demo of all the icons on an
HTTP server on `localhost:8080`.

To display all JS SVG path icons, you can run the demo site with `yarn start` or go to https://design.lumapps.com/. Then,
go to the "Iconography" page on which the full icon library is displayed.
