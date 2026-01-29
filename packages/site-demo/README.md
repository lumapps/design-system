# Site Demo Package

Documentation site for the LumX design system built with Gatsby and MDX.

## Table of Contents

-   [Menu Structure](#menu-structure)
-   [Creating Pages](#creating-pages)
    -   [Frontmatter](#frontmatter)
    -   [Framework-Agnostic Pages](#framework-agnostic-pages)
    -   [Framework-Specific Pages](#framework-specific-pages)
-   [Demo Sandbox](#demo-sandbox)
-   [Components](#components)
    -   [DemoBlock](#demoblock)
    -   [FrameworkOnly](#frameworkonly)
    -   [PropTable](#proptable)

## Menu Structure

The navigation menu is defined in [`content/menu.yml`](./content/menu.yml)

**Key features:**

-   Use the `'*'` wildcard to auto-include all subdirectories (used for Components)
-   Explicitly list pages for custom ordering
-   Nested structure creates the navigation hierarchy
-   Page names match the folder names in `content/`

## Creating Pages

Documentation is written in MDX files located in `content/`. Each page is an `index.mdx` file inside its respective folder.

### Page Structure

MDX pages follow this structure:

1. **Frontmatter** (optional)
2. **Imports** (demo files, components)
3. **Description** (single bold sentence defining the component/concept)
4. **Sections** (features, variants, states, examples)
5. **Accessibility concerns** (when applicable)
6. **Properties** (PropTable(s))

### Content Writing Conventions

-   **Descriptions**: Start with a one-sentence description in bold: `**Buttons trigger actions with a single click.**`
-   **Cross-references**: Link to related pages using relative paths: `[foundation colors](/product/foundations/color)`
-   **Sections**: Use `##` and `###` headings to organize by features, variants, states, or examples

### Demo Files

Demo files live in `react/` and/or `vue/` subdirectories:

```
content/product/components/button/
├── react/
│   ├── demo1.tsx
│   └── demo2.tsx
├── vue/
│   └── demo1.vue
└── index.mdx
```

**Demo conventions:**

-   Name demos sequentially: `demo1.tsx`, `demo2.tsx`, etc.
-   Export a default component that accepts an optional `theme` prop when using `withThemeSwitcher`

**Example demo file:**

```tsx
import { Button, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => <Button theme={theme}>Example</Button>;
```

### Frontmatter

MDX pages can have a "frontmatter" section at the top for metadata. We use it to tag page for a specific framework of both frameworks.

### Framework-Agnostic Pages

Pages with `frameworks: ['react', 'vue']` (or without this field) in the "frontmatter" are considered framework-agnostic or multi-framework.

```mdx
---
frameworks: ['react', 'vue']
---

# Framework agnostic page

...
```

### Framework-Specific Pages

Pages with a single framework in the `frameworks` array show documentation for that framework only.

Example from `content/product/utilities/miscellaneous/index.mdx`:

```mdx
---
frameworks: ['react']
---

# React only page

...
```

## Demo Sandbox

Each `DemoBlock` includes an "Live Preview" button that opens an interactive sandbox powered by [Sandpack](https://sandpack.codesandbox.io/). This allows documentation readers to experiment with the code directly in the browser.

### Version Control

By default, the sandbox uses the same `@lumx/*` package version as the documentation site. You can override this using the `frontVersion` URL query parameter:

| URL                                              | Sandbox uses                         |
| ------------------------------------------------ | ------------------------------------ |
| `/product/components/button`                     | Current site version (e.g., `4.2.0`) |
| `/product/components/button?frontVersion=latest` | `latest` npm tag                     |
| `/product/components/button?frontVersion=alpha`  | `alpha` npm tag                      |
| `/product/components/button?frontVersion=4.2.1`  | Specific version `4.2.1`             |

This is useful for testing demos against different versions or pre-release builds.

## Components

### DemoBlock

Displays code examples with optional theme switching:

```mdx
import * as Demo1 from './react/demo1.tsx';
import * as Demo2 from './react/demo2.tsx';
import * as VueDemo1 from './vue/demo1.vue';

<DemoBlock
  orientation="horizontal"      # Layout: horizontal or vertical (default)
  vAlign="center"              # Vertical alignment for single demos
  withThemeSwitcher            # Shows light/dark theme toggle
  theme="dark"                  # Default theme
  alwaysShowCode               # Show code by default
  demo={{
    react: Demo1,               # Single framework demo
    # OR
    react: Demo1,               # Multi-framework demos
    vue: VueDemo1
  }}
/>
```

**Theme Switcher:**
When `withThemeSwitcher` is enabled, demos receive a `theme` prop that can be used to adapt the component styling.

**Naming imports:**
Import demos as `Demo1`, `Demo2`, etc., and use `VueDemo1`, `VueDemo2` when both frameworks are present.

### FrameworkOnly

Conditionally renders content for a specific framework:

```mdx
<FrameworkOnly framework="react">

## React-Specific Section

This content only appears when React is selected.

</FrameworkOnly>
```

### PropTable

Displays React component props documentation:

```mdx
import ReactButton from 'lumx-docs:@lumx/react/components/button/Button';
import ReactIconButton from 'lumx-docs:@lumx/react/components/button/IconButton';

### Button properties

<PropTable docs={{ react: ReactButton }} />

### IconButton properties

<PropTable docs={{ react: ReactIconButton }} />
```

The component must be imported using the `lumx-docs:` prefix to access the documentation metadata.

Multiple PropTables can be shown for related components.

## File Structure

```
content/
├── menu.yml                    # Navigation structure
├── partners/
│   └── index.mdx
└── product/
    ├── components/
    │   └── icon/
    │       ├── assets/         # Images and static assets
    │       │   └── anatomy.png
    │       ├── react/          # React demo files
    │       │   ├── demo1.tsx
    │       │   └── demo2.tsx
    │       ├── vue/            # Vue demo files (optional)
    │       │   ├── demo1.vue
    │       │   └── demo2.vue
    │       └── index.mdx       # Documentation page
    ├── foundations/
    ├── patterns/
    ├── utilities/
    └── design-tokens/
```

Each documentation page is an `index.mdx` file with optional `react/` and `vue/` subdirectories containing demo files.
