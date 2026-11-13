import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, getByTagName } from '@lumx/react/testing/utils/queries';
import { TextField } from '@lumx/react';
import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import { DatePickerField, DatePickerFieldProps } from './DatePickerField';

const mockedDate = new Date(1487721600000);

vi.mock('@lumx/core/js/utils/date/getYearDisplayName', () => ({
    getYearDisplayName: () => 'année',
}));

const setup = (propsOverride: Partial<DatePickerFieldProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: DatePickerFieldProps = {
        label: 'DatePickerField',
        locale: 'fr',
        onChange: vi.fn(),
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        ...propsOverride,
    };
    render(<DatePickerField {...props} />, { wrapper });
    const textField = getByClassName(document.body, TextField.className as string);
    const inputNative = getByTagName(textField, 'input');
    return { props, textField, inputNative };
};

describe(`<${DatePickerField.displayName}>`, () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(mockedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should call onChange with the picked date and the name', async () => {
        const { inputNative, props } = setup({ name: 'date' });
        await userEvent.click(inputNative);
        await userEvent.click(screen.getByRole('gridcell', { name: /15 février 2017/i }));
        expect(props.onChange).toHaveBeenCalledWith(expect.any(Date), 'date');
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: TextField.className as string,
        forwardRef: 'textField',
        forwardAttributes: 'inputNative',
        forwardClassName: 'textField',
        applyTheme: {
            affects: [{ element: 'textField' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
