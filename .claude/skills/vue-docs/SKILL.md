---
name: vue-docs
description: >
    Add or update Vue documentation for a component: Vue demo files (.vue SFCs), PropTable integration
    (props/events/slots), and MDX page updates. Use when a component in @lumx/vue needs Vue demos
    or prop table documentation added alongside existing React documentation.
---

# Vue Component Documentation

Add Vue documentation for a component on the site-demo documentation site: demo files, prop table integration, and MDX page wiring.

For general documentation site conventions (page structure, frontmatter, DemoBlock, PropTable, file layout), see `packages/site-demo/README.md`.

## Prerequisites

1. The component must exist in `@lumx/vue` (check `packages/lumx-vue/src/components/`)
2. An MDX page should exist at `packages/site-demo/content/product/components/<component>/index.mdx`
3. React demos should exist in `packages/site-demo/content/product/components/<component>/react/`

## Steps

### Step 1: Gather Context

1. **Read the React demos** in `content/product/components/<component>/react/`
2. **Read the MDX page** at `content/product/components/<component>/index.mdx`
3. **Check available Vue components** by reading `packages/lumx-vue/src/components/<component>/index.ts`
4. **Check if any Vue demos already exist** in `content/product/components/<component>/vue/`

### Step 2: Create Vue Demo Files

Create Vue demos in `content/product/components/<component>/vue/` matching each React demo.

**File naming:** Match the React demo numbering: `demo1.vue`, `demo2.vue`, etc.

**Template structure:**

```vue
<template>
    <!-- Component usage -->
</template>

<script setup lang="ts">
import { ref } from 'vue'; // only if stateful
import { mdiPencil } from '@lumx/icons'; // only if icons are used
import { ComponentName, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>(); // only if withThemeSwitcher
</script>
```

**When to include `theme` prop:** Only when the corresponding `DemoBlock` in the MDX uses `withThemeSwitcher`.

**Key conversion rules (React to Vue):**

-   **Props:** camelCase to kebab-case in templates (`leftIcon` -> `:left-icon`, `isDisabled` -> `is-disabled`)
-   **Events:** React callbacks to Vue events (`onChange={handler}` -> `@change="handler"`, `onClick` -> `@click`)
-   **State:** `useState` to `ref()` (`const [checked, setChecked] = useState(false)` -> `const checked = ref(false)`)
-   **State updates in events:** `@change="checked = $event"` or `@click="active = !active"`
-   **Icons:** Import from `@lumx/icons`
-   **Missing components:** If a React demo uses a component not in `@lumx/vue`, substitute with available components or plain HTML
-   **Always verify** that imported components exist in `@lumx/vue` before using them

### Step 3: Update the MDX Page

Update `content/product/components/<component>/index.mdx`:

1. **Frontmatter:** Ensure `frameworks: ['react', 'vue']`
2. **Rename React demo imports** from `Demo1` to `ReactDemo1` if needed (multi-framework convention)
3. **Add Vue demo imports** as `VueDemo1`, `VueDemo2`, etc.
4. **Update DemoBlock** to include both frameworks: `demo={{ react: ReactDemo1, vue: VueDemo1 }}`
5. **Add Vue PropTable import** using the `lumx-docs:@lumx/vue/...` prefix
6. **Update PropTable** to include Vue docs: `docs={{ react: ReactButton, vue: VueButton }}`

**Example MDX diff:**

```mdx
import * as ReactDemo1 from './react/demo1.tsx';
+import * as VueDemo1 from './vue/demo1.vue';
import ReactButton from 'lumx-docs:@lumx/react/components/button/Button';
+import VueButton from 'lumx-docs:@lumx/vue/components/button/Button';

-<DemoBlock orientation="horizontal" withThemeSwitcher demo={{ react: ReactDemo1 }} />
+<DemoBlock orientation="horizontal" withThemeSwitcher demo={{ react: ReactDemo1, vue: VueDemo1 }} />

-<PropTable docs={{ react: ReactButton }} />
+<PropTable docs={{ react: ReactButton, vue: VueButton }} />
```

### Step 4: Verify

1. All Vue demo files created, matching the React demo count
2. All imports in the MDX file are correct
3. DemoBlock components reference both `react` and `vue` demos
4. PropTable components include both `react` and `vue` doc imports
5. Frontmatter includes both frameworks

## Vue PropTable Docgen

The prop table documentation is auto-extracted from Vue component source files by `plugins/lumx-prop-table/vue-docgen.js`. It extracts:

-   **Props:** From the exported `*Props` type alias (e.g., `ButtonProps = VueToJSXProps<UIProps>`)
-   **Events:** From exported `emitSchema` objects or inline `emits: [...]` arrays in defineComponent options
-   **Slots:** By detecting `slots.default` usage in the component source

You can test the extraction for any Vue component via CLI:

```bash
node packages/site-demo/plugins/lumx-prop-table/vue-docgen.js packages/lumx-vue/src/components/<component>/<Component>.tsx
```

## File Structure

### Before (React-only)

```
content/product/components/<component>/
├── react/
│   ├── demo1.tsx
│   └── demo2.tsx
└── index.mdx
```

### After (both frameworks)

```
content/product/components/<component>/
├── react/
│   ├── demo1.tsx
│   └── demo2.tsx
├── vue/
│   ├── demo1.vue
│   └── demo2.vue
└── index.mdx          # Updated with Vue imports, DemoBlock, and PropTable
```
