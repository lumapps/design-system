/* eslint-disable import/no-extraneous-dependencies */
import Module from 'node:module';
import { vi } from 'vitest';

// `resolve.alias` only rewrites ESM `import 'vue'` resolved through Vite's module graph.
// `@vue/test-utils` and `@testing-library/vue` are plain CJS: their `require('vue')` calls run
// through Node's native loader, which never sees the alias. Patching the loader is the only way
// to make every part of the render tree share the same `@vue/compat` instance.
const originalRequire = Module.prototype.require;
// @ts-expect-error -- Node's `require` type doesn't model this override shape.
Module.prototype.require = function patchedRequire(id: string) {
    const target = id === 'vue' ? '@vue/compat' : id;
    // eslint-disable-next-line prefer-rest-params
    return originalRequire.apply(this, [target, ...Array.prototype.slice.call(arguments, 1)]);
};

const FAILING_DEPRECATIONS = [
    '(deprecation COMPONENT_ASYNC)',
    '(deprecation INSTANCE_ATTRS_CLASS_STYLE)',
    '(deprecation INSTANCE_EVENT_EMITTER)',
    '(deprecation INSTANCE_EVENT_HOOKS)',
];

const originalWarn = console.warn;

// Never call `configureCompat`: this project proves that LumX works with no app-side opt-out.
// `RENDER_FUNCTION` (app creation), `GLOBAL_MOUNT` and `CONFIG_PRODUCTION_TIP` (test harness)
// come from outside LumX, so they stay as warnings.
vi.spyOn(console, 'warn').mockImplementation((message, ...args) => {
    if (FAILING_DEPRECATIONS.some((deprecation) => String(message).includes(deprecation))) {
        throw new Error(`Unexpected Vue compat deprecation warning: ${message}`);
    }
    originalWarn(message, ...args);
});
