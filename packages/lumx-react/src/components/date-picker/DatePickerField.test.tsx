import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { TextField } from '@lumx/react';

import userEvent from '@testing-library/user-event';
import { DatePickerField, DatePickerFieldProps } from './DatePickerField';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000);
Date.now = vi.fn(() => mockedDate.valueOf());
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
