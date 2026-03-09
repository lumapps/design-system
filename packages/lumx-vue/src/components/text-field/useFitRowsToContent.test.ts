/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, nextTick, ref } from 'vue';
import { render } from '@testing-library/vue';
import { useFitRowsToContent } from './useFitRowsToContent';

describe('useFitRowsToContent', () => {
    const testId = 'textarea-wrapper';

    const makeSetup = (minimumRowsInit: number, valueInit: string | undefined, withTextarea = true) => {
        const minimumRows = ref(minimumRowsInit);
        const value = ref(valueInit);
        const textareaRef = ref<HTMLTextAreaElement | null>(null);
        let rows: ReturnType<typeof useFitRowsToContent>;

        const Component = defineComponent({
            setup() {
                rows = useFitRowsToContent(minimumRows, textareaRef, value);
                return () =>
                    h('div', { 'data-testid': testId }, [
                        withTextarea ? h('textarea', { ref: textareaRef, rows: rows.value }) : null,
                    ]);
            },
        });

        const renderResult = render(Component);
        return { renderResult, minimumRows, value, getRows: () => rows.value };
    };

    it('should return minimumRows as initial value', () => {
        const { getRows } = makeSetup(3, undefined);
        expect(getRows()).toBe(3);
    });

    it('should return minimumRows when textarea is null', async () => {
        const { getRows } = makeSetup(2, undefined, false);
        await nextTick();
        expect(getRows()).toBe(2);
    });

    it('should fallback to minimumRows when rowHeight is 0 (jsdom)', async () => {
        // In jsdom, clientHeight is 0, so rowHeight = 0 → fallback to minimumRows
        const { getRows } = makeSetup(4, 'some content');
        await nextTick();
        expect(getRows()).toBe(4);
    });

    it('should react to minimumRows changes', async () => {
        const { minimumRows, getRows } = makeSetup(2, undefined);
        await nextTick();

        minimumRows.value = 5;
        await nextTick();
        await nextTick(); // flush: 'post' may need an extra tick

        expect(getRows()).toBe(5);
    });

    it('should react to value changes', async () => {
        const { value, getRows } = makeSetup(2, '');
        await nextTick();

        value.value = 'updated content';
        await nextTick();
        await nextTick();

        // In jsdom, still falls back to minimumRows since clientHeight is 0
        expect(getRows()).toBe(2);
    });
});
