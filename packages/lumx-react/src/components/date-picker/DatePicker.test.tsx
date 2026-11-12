import React from 'react';
import { DatePickerProps } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { act, render, screen, fireEvent } from '@testing-library/react';
import datePickerTests from '@lumx/core/js/components/DatePicker/Tests';
import { vi } from 'vitest';

import { DatePicker, DatePickerField } from '.';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000); // Feb 22 2017

vi.mock('@lumx/core/js/utils/date/getYearDisplayName', () => ({
    getYearDisplayName: () => 'année',
}));

/**
 * Render a template with a controlled `value` state, updated by `onChange` (then calls `initialArgs.onChange`).
 * The other args can be changed with `setArgs`.
 */
function renderWithState(template: (props: any) => React.JSX.Element, initialArgs: Record<string, any> = {}) {
    let updateArgs: React.Dispatch<React.SetStateAction<Record<string, any>>> = () => {};
    const Wrapper = () => {
        const [args, setArgs] = React.useState(initialArgs);
        const [value, setValue] = React.useState<Date | undefined>(initialArgs.value ?? undefined);
        updateArgs = setArgs;
        return template({
            ...args,
            value,
            onChange: (newValue: Date | undefined, ...rest: any[]) => {
                setValue(newValue);
                args.onChange?.(newValue, ...rest);
            },
        });
    };
    const result = render(<Wrapper />);
    const setArgs = async (newArgs: Record<string, any>) => {
        await act(async () => updateArgs((args) => ({ ...args, ...newArgs })));
    };
    return { ...result, setArgs };
}

const setup = (propsOverride: Partial<DatePickerProps> = {}) => {
    const props: DatePickerProps = {
        locale: 'fr',
        onChange: vi.fn(),
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        ...propsOverride,
    };
    render(<DatePicker {...props} />);
    const datePicker = getByClassName(document.body, CLASSNAME);
    return { props, datePicker };
};

// Shared core test suite (DatePicker and DatePickerField), with real dates.
describe('DatePicker core tests', () => {
    datePickerTests({ components: { DatePicker, DatePickerField }, renderWithState });
});

describe(`<${DatePicker.displayName}>`, () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardRef: 'datePicker',
        forwardClassName: 'datePicker',
        forwardAttributes: 'datePicker',
        applyTheme: {
            affects: [{ element: 'datePicker' }],
            viaProp: true,
            viaContext: false,
        },
    });

    describe('Keyboard', () => {
        it('should show the month of a key move and focus its day in StrictMode', () => {
            render(
                <React.StrictMode>
                    <DatePicker
                        locale="fr"
                        onChange={vi.fn()}
                        value={new Date(2017, 1, 28)}
                        nextButtonProps={{ label: 'Next month' }}
                        previousButtonProps={{ label: 'Previous month' }}
                    />
                </React.StrictMode>,
            );
            screen.getByRole('gridcell', { name: /28 février 2017/i }).focus();
            fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
            expect(screen.getByText('mars 2017')).toBeInTheDocument();
            expect(screen.getByRole('gridcell', { name: /^1 mars 2017/i })).toHaveFocus();
        });
    });
});
