import { defineComponent, nextTick, ref, shallowRef } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { vi } from 'vitest';

import datePickerTests from '@lumx/core/js/components/DatePicker/Tests';
import { CLASSNAME } from '@lumx/core/js/components/DatePicker/constants';
import { CLASSNAME as TEXT_FIELD_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { getByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';

import { DatePicker, DatePickerField } from '.';

const mockedDate = new Date(1487721600000); // Feb 22 2017

const MONTH_BUTTON_PROPS = {
    nextButtonProps: { label: 'Next month' },
    previousButtonProps: { label: 'Previous month' },
};

/**
 * Render a template with a controlled `value` state, updated by the `change` emit (then calls
 * `initialArgs.onChange` with all the emitted arguments). The other args can be changed with `setArgs`.
 */
function renderWithState(template: (props: any) => any, initialArgs: Record<string, any> = {}) {
    const args = shallowRef(initialArgs);
    const Wrapper = defineComponent({
        setup() {
            const value = ref<Date | undefined>(initialArgs.value ?? undefined);
            return () =>
                template({
                    ...args.value,
                    value: value.value,
                    onChange: (newValue: Date | undefined, ...rest: any[]) => {
                        value.value = newValue;
                        args.value.onChange?.(newValue, ...rest);
                    },
                });
        },
    });
    const { unmount, container } = render(Wrapper);
    const setArgs = async (newArgs: Record<string, any>) => {
        args.value = { ...args.value, ...newArgs };
        await nextTick();
    };
    return { unmount, container: container as HTMLElement, setArgs };
}

// Shared core test suite (DatePicker and DatePickerField), with real dates.
describe('DatePicker core tests', () => {
    datePickerTests({ components: { DatePicker, DatePickerField }, renderWithState });
});

describe(`<${DatePicker.name}>`, () => {
    const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
        const props = { locale: 'fr', value: mockedDate, ...MONTH_BUTTON_PROPS, ...propsOverride };
        render(DatePicker, { ...options, props });
        const datePicker = getByClassName(document.body, CLASSNAME);
        return { props, datePicker };
    };

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'datePicker',
        forwardAttributes: 'datePicker',
        applyTheme: {
            affects: [{ element: 'datePicker' }],
            viaProp: true,
            viaContext: false,
        },
    });

    it('should forward the roving day button to todayOrSelectedDateRef', () => {
        const todayOrSelectedDateRef = ref<HTMLElement | null>(null);
        setup({ todayOrSelectedDateRef });
        expect(todayOrSelectedDateRef.value).toBeInstanceOf(HTMLButtonElement);
        expect(todayOrSelectedDateRef.value).toHaveAttribute('data-date', '2017-02-22');
    });
});

describe(`<${DatePickerField.name}>`, () => {
    const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
        const props = { label: 'Date', locale: 'en-US', value: mockedDate, ...MONTH_BUTTON_PROPS, ...propsOverride };
        render(DatePickerField, { ...options, props });
        const textField = getByClassName(document.body, TEXT_FIELD_CLASSNAME);
        return { props, textField };
    };

    commonTestsSuiteVTL(setup, {
        baseClassName: TEXT_FIELD_CLASSNAME,
        forwardClassName: 'textField',
        applyTheme: {
            affects: [{ element: 'textField' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });

    it('should emit change with undefined and the name on clear', async () => {
        const onChange = vi.fn();
        setup({ name: 'date', clearButtonProps: { label: 'Clear' }, onChange });
        await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(onChange).toHaveBeenCalledWith(undefined, 'date');
        expect(screen.getByRole('combobox', { name: 'Date' })).toHaveValue('');
    });

    it('should emit focus and blur', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        setup({ onFocus, onBlur });
        const input = screen.getByRole('combobox', { name: 'Date' });
        await fireEvent.focus(input);
        expect(onFocus).toHaveBeenCalled();
        await fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalled();
    });
});
