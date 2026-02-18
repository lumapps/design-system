import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useHasEventListener } from './useHasEventListener';

describe('useHasEventListener', () => {
    it('should return true when event listener exists', () => {
        let hasListener: boolean | undefined;

        const TestComponent = defineComponent({
            setup() {
                hasListener = useHasEventListener('onClick');
                return () => h('div', 'test');
            },
        });

        mount(TestComponent, {
            props: {
                onClick: () => {},
            },
        });

        expect(hasListener).toBe(true);
    });

    it('should return false when event listener does not exist', () => {
        let hasListener: boolean | undefined;

        const TestComponent = defineComponent({
            setup() {
                hasListener = useHasEventListener('onClick');
                return () => h('div', 'test');
            },
        });

        mount(TestComponent);

        expect(hasListener).toBe(false);
    });

    it('should work with different event names', () => {
        let hasClickListener: boolean | undefined;
        let hasKeyPressListener: boolean | undefined;

        const TestComponent = defineComponent({
            setup() {
                hasClickListener = useHasEventListener('onClick');
                hasKeyPressListener = useHasEventListener('onKeyPress');
                return () => h('div', 'test');
            },
        });

        mount(TestComponent, {
            props: {
                onKeyPress: () => {},
            },
        });

        expect(hasClickListener).toBe(false);
        expect(hasKeyPressListener).toBe(true);
    });
});
