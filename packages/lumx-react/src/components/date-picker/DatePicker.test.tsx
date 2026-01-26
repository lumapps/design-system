import { DatePickerProps } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { DatePicker } from '.';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000); // Feb 22 2017

vi.mock('@lumx/react/utils/date/getYearDisplayName', () => ({
    getYearDisplayName: () => 'année',
}));

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
    });

    describe('Navigation', () => {
        it('should change month when clicking next/prev buttons (uncontrolled)', () => {
            setup();
            // Initial month: Février 2017
            expect(screen.getByText('février 2017')).toBeInTheDocument();

            const nextBtn = screen.getByRole('button', { name: 'Next month' });
            fireEvent.click(nextBtn);
            // Next month: Mars 2017
            expect(screen.getByText('mars 2017')).toBeInTheDocument();

            const prevBtn = screen.getByRole('button', { name: 'Previous month' });
            fireEvent.click(prevBtn);
            // Back to Février 2017
            expect(screen.getByText('février 2017')).toBeInTheDocument();
        });
    });

    describe('Validation', () => {
        it('should warn and use current date if value is invalid', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const invalidDate = new Date('invalid');
            setup({ value: invalidDate });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid date provided'));
            // Should fallback to mocked current date (Feb 2017)
            expect(screen.getByText('février 2017')).toBeInTheDocument();

            consoleSpy.mockRestore();
        });
    });
});
