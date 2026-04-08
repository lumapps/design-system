import { describe, it, expect } from 'vitest';
import { defineComponent, h, type ComputedRef } from 'vue';
import { mount } from '@vue/test-utils';
import { useAttrFallback } from './useAttrFallback';

/**
 * Helper that mounts a minimal component using `useAttrFallback` and captures
 * the returned computed ref so we can assert its value after mount.
 */
function mountWithAttrFallback<T>(
    vuePropGetter: () => T,
    attrFallback: string,
    merge?: (vue: T, attr: unknown) => T,
    mountOptions?: Record<string, any>,
): ComputedRef<T> {
    let result!: ComputedRef<T>;

    const TestComponent = defineComponent({
        inheritAttrs: false,
        setup() {
            result = useAttrFallback(vuePropGetter, attrFallback, merge);
            return () => h('div');
        },
    });

    mount(TestComponent, mountOptions);
    return result;
}

describe('useAttrFallback', () => {
    describe('default merge (vueProp ?? attrFallback)', () => {
        it('should return the Vue prop value when it is set', () => {
            const result = mountWithAttrFallback(() => 'vue-value', 'attrProp', undefined, {
                attrs: { attrProp: 'attr-value' },
            });
            expect(result.value).toBe('vue-value');
        });

        it('should fall back to the attr when Vue prop is undefined', () => {
            const result = mountWithAttrFallback(() => undefined as string | undefined, 'attrProp', undefined, {
                attrs: { attrProp: 'attr-value' },
            });
            expect(result.value).toBe('attr-value');
        });

        it('should return undefined when both Vue prop and attr are absent', () => {
            const result = mountWithAttrFallback(() => undefined as string | undefined, 'attrProp');
            expect(result.value).toBeUndefined();
        });

        it('should handle numeric values (e.g. tabIndex)', () => {
            const result = mountWithAttrFallback(() => undefined as number | undefined, 'tabIndex', undefined, {
                attrs: { tabIndex: -1 },
            });
            expect(result.value).toBe(-1);
        });
    });

    describe('custom merge function', () => {
        it('should call the merge function with both values', () => {
            const result = mountWithAttrFallback(
                () => 'vue-class' as string | undefined,
                'className',
                (vue, attr) => [vue, attr].filter(Boolean).join(' ') || undefined,
                { attrs: { className: 'attr-class' } },
            );
            expect(result.value).toBe('vue-class attr-class');
        });

        it('should use merge result even when Vue prop is undefined', () => {
            const result = mountWithAttrFallback(
                () => undefined as string | undefined,
                'className',
                (vue, attr) => [vue, attr].filter(Boolean).join(' ') || undefined,
                { attrs: { className: 'attr-class' } },
            );
            expect(result.value).toBe('attr-class');
        });

        it('should return undefined from merge when both are absent', () => {
            const result = mountWithAttrFallback(
                () => undefined as string | undefined,
                'className',
                (vue, attr) => [vue, attr].filter(Boolean).join(' ') || undefined,
            );
            expect(result.value).toBeUndefined();
        });
    });
});
