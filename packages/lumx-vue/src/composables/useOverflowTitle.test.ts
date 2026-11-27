/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { render } from '@testing-library/vue';
import { useOverflowTitle } from './useOverflowTitle';

describe('useOverflowTitle', () => {
    it('should set label on mount if text overflows', () => {
        const element = document.createElement('div');
        element.innerText = 'Long text';
        Object.defineProperties(element, { offsetWidth: { value: 50 }, scrollWidth: { value: 100 } });

        let result: any;
        const TestComponent = defineComponent({
            setup() {
                result = useOverflowTitle(ref(element));
                return () => null;
            },
        });
        render(TestComponent);

        expect(result.title.value).toBe('Long text');
    });

    it('should update label after a render', async () => {
        const element = document.createElement('div');
        element.innerText = 'Text';
        Object.defineProperties(element, {
            offsetWidth: { value: 100 },
            scrollWidth: { value: 100, configurable: true },
        });

        let result: any;
        const TestComponent = defineComponent({
            props: { text: { type: String, default: '' } },
            setup(props) {
                result = useOverflowTitle(ref(element));
                return () => h('span', props.text);
            },
        });
        const { rerender } = render(TestComponent, { props: { text: 'Text' } });
        expect(result.title.value).toBeUndefined();

        element.innerText = 'Text Text';
        Object.defineProperty(element, 'scrollWidth', { value: 200 });
        await rerender({ text: 'Text Text' });

        expect(result.title.value).toBe('Text Text');
    });
});
