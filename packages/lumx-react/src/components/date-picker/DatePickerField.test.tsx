import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { TextField } from '@lumx/react';
import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import { DatePickerField, DatePickerFieldProps } from './DatePickerField';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000);

vi.mock('@lumx/react/utils/date/getYearDisplayName', () => ({
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
    const getDatePicker = () => queryByClassName(document.body, CLASSNAME);
    return { props, textField, inputNative, getDatePicker };
};

describe(`<${DatePickerField.displayName}>`, () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(mockedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render', () => {
        const { inputNative, props } = setup();
        expect(inputNative).toBe(screen.queryByRole('textbox', { name: props.label }));
        expect(inputNative).toHaveValue('22 février 2017');
    });

    it('should open on click', async () => {
        const { getDatePicker, inputNative } = setup();
        expect(getDatePicker()).not.toBeInTheDocument();

        await userEvent.click(inputNative);
        expect(getDatePicker()).toBeInTheDocument();
    });

    it('should open on Enter pressed', async () => {
        const { getDatePicker, inputNative } = setup();
        expect(getDatePicker()).not.toBeInTheDocument();

        await userEvent.tab();
        expect(inputNative).toHaveFocus();
        await userEvent.keyboard('[Enter]');
        expect(getDatePicker()).toBeInTheDocument();
    });

    it('should select a date and close popover', async () => {
        const { getDatePicker, inputNative, props } = setup();

        // Open
        await userEvent.click(inputNative);
        expect(getDatePicker()).toBeInTheDocument();

        // Select a date (e.g. 15th)
        // Note: DatePicker renders in a Portal, so getDatePicker finds it in document.body
        // The date picker popover renders at the bottom of the body usually.
        // We use screen.getByRole which queries the whole document.
        const dayBtn = screen.getByRole('button', { name: /15 février 2017/i });
        await userEvent.click(dayBtn);

        expect(props.onChange).toHaveBeenCalledWith(expect.any(Date), undefined);
        expect(getDatePicker()).not.toBeInTheDocument();
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
