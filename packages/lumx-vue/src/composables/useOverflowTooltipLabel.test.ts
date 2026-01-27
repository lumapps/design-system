/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { nextTick, defineComponent, ref } from 'vue';
import { render } from '@testing-library/vue';
import { useOverflowTooltipLabel } from './useOverflowTooltipLabel';

describe('useOverflowTooltipLabel', () => {
    // Mock ResizeObserver
    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    afterAll(() => {
        delete (global as any).ResizeObserver;
    });

    const mockElement = (text: string, offsetWidth: number, scrollWidth: number) => {
        const element = document.createElement('div');
        element.innerText = text;
        Object.defineProperties(element, {
            offsetWidth: { value: offsetWidth, configurable: true },
            scrollWidth: { value: scrollWidth, configurable: true },
        });
        return element;
    };

    it('should set label if text overflows', async () => {
        const text = 'Long text';
        const element = mockElement(text, 50, 100);

        let result: any;
        const TestComponent = defineComponent({
            setup() {
                const labelRef = ref<HTMLElement>();
                result = { ...useOverflowTooltipLabel(labelRef), labelRef };
                return () => null;
            },
        });

        render(TestComponent);

        result.labelRef.value = element;
        await nextTick();

        expect(result.tooltipLabel.value).toBe(text);
    });

    it('should NOT set label if text does not overflow', async () => {
        const text = 'Short text';
        const element = mockElement(text, 100, 100);

        let result: any;
        const TestComponent = defineComponent({
            setup() {
                const labelRef = ref<HTMLElement>();
                result = { ...useOverflowTooltipLabel(labelRef), labelRef };
                return () => null;
            },
        });

        render(TestComponent);

        result.labelRef.value = element;
        await nextTick();

        expect(result.tooltipLabel.value).toBeUndefined();
    });
});
