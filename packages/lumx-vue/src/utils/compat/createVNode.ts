import { createVNode } from 'vue';
import * as vue from 'vue';

import { VUE_3_COMPAT_CONFIG } from './compatOptions';

// `vue@3.5.27` exports `compatUtils` as `null`; `@vue/compat` exports an object. The namespace
// read keeps this true even if the alias resolves a Vue version that changes the export.
const IS_COMPAT = Boolean((vue as { compatUtils?: unknown }).compatUtils);

/** Marks a function component with Vue 3 behaviour, then delegates to the real `createVNode`. */
function createVNodeWithCompatFlag(...args: Parameters<typeof createVNode>): ReturnType<typeof createVNode> {
    const [type] = args;
    if (typeof type === 'function') {
        const fn = type as { compatConfig?: typeof VUE_3_COMPAT_CONFIG };
        if (!fn.compatConfig) {
            fn.compatConfig = VUE_3_COMPAT_CONFIG;
        }
    }
    return createVNode(...args);
}

/**
 * Pragma target of the Vue JSX plugin. Compat reads the `compatConfig` flag on the component
 * that renders, and a function component renders its own children, so the flag must be set here,
 * on the function itself, before it is ever invoked.
 */
export const __lumxCreateVNode: typeof createVNode = IS_COMPAT ? createVNodeWithCompatFlag : createVNode;
