/**
 * Browser-only test stories for the DatePicker and the DatePickerField.
 *
 * These tests need a real browser (Playwright via Vitest browser mode): the dialog focus trap, the Tab order, the
 * pointer events, the real styles and the accessibility check (axe, from the Storybook a11y addon in `error` mode).
 *
 * The other date picker tests run in jsdom (see Tests.tsx).
 */
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { getCalendarDate } from '../../utils/date/calendarDay';
import { CLASSNAME } from './constants';

/** Month button props (required props of both components). */
const MONTH_BUTTON_PROPS = {
    nextButtonProps: { label: 'Next month' },
    previousButtonProps: { label: 'Previous month' },
};

/** Fail the story test on any accessibility violation (axe runs after the play function). */
const A11Y_ERROR = { a11y: { test: 'error' } };

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

/** Accessible name of the day button of a date (`en-US`). */
const dayName = (date: Date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

const getInput = () => screen.getByRole('combobox', { name: 'Date' });

/** Wait for the day button of a date to have the focus. */
const expectDayFocus = (date: Date) =>
    waitFor(() => expect(screen.getByRole('gridcell', { name: dayName(date) })).toHaveFocus());

export function setup({
    components: { DatePicker, DatePickerField },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: { DatePicker: any; DatePickerField: any };
    decorators: 'withValueOnChange';
}>) {
    const meta = {
        component: DatePickerField,
        render: (args: any) => <DatePickerField {...args} />,
        args: { label: 'Date', locale: 'en-US', value: day(2026, 11, 12), ...MONTH_BUTTON_PROPS },
        decorators: [withValueOnChange()],
    };

    /** Tab order in the dialog: previous month, year input, next month, grid (one Tab stop). The focus trap wraps. */
    const DialogTabOrder = {
        async play() {
            await userEvent.click(getInput());
            await expectDayFocus(day(2026, 11, 12));
            await userEvent.tab();
            await expect(screen.getByRole('button', { name: 'Previous month' })).toHaveFocus();
            await userEvent.tab();
            await expect(screen.getByRole('spinbutton')).toHaveFocus();
            await userEvent.tab();
            await expect(screen.getByRole('button', { name: 'Next month' })).toHaveFocus();
            await userEvent.tab();
            await expectDayFocus(day(2026, 11, 12));
        },
    };

    /** Escape and a click on the input close the dialog, focus goes back to the input. */
    const DialogClose = {
        async play() {
            const input = getInput();
            await userEvent.click(input);
            await screen.findByRole('dialog', { name: 'Date' });
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            await waitFor(() => expect(input).toHaveFocus());
            await expect(input).toHaveAttribute('aria-expanded', 'false');

            await userEvent.keyboard('{ArrowDown}');
            await screen.findByRole('dialog', { name: 'Date' });
            await userEvent.click(input);
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            await waitFor(() => expect(input).toHaveFocus());
        },
    };

    /** Grid keys across the month edges, then Enter picks the day and closes the dialog. */
    const KeyboardMonthEdges = {
        args: { value: day(2026, 11, 30) },
        async play() {
            await userEvent.click(getInput());
            await expectDayFocus(day(2026, 11, 30));
            await userEvent.keyboard('{ArrowRight}');
            await expectDayFocus(day(2026, 12, 1));
            await expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
            await userEvent.keyboard('{ArrowUp}');
            await expectDayFocus(day(2026, 11, 24));
            await userEvent.keyboard('{End}{PageDown}');
            await expectDayFocus(day(2026, 12, 28));
            await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
            await expectDayFocus(day(2027, 12, 28));
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            await expect(getInput()).toHaveValue('December 28, 2027');
            await waitFor(() => expect(getInput()).toHaveFocus());
        },
    };

    /** A move to a day out of the range does not move the focus (no clamp to the range edge). */
    const KeyboardRangeEdges = {
        args: { value: day(2026, 11, 17), minDate: day(2026, 11, 4), maxDate: day(2026, 11, 20) },
        async play() {
            await userEvent.click(getInput());
            await expectDayFocus(day(2026, 11, 17));
            await userEvent.keyboard('{ArrowDown}{PageDown}');
            await expectDayFocus(day(2026, 11, 17));
            await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
            await expectDayFocus(day(2026, 11, 20));
            await expect(screen.getByRole('gridcell', { name: dayName(day(2026, 11, 21)) })).toBeDisabled();
        },
    };

    /** Typed dates: Enter and blur commit, an invalid text shows the value again. */
    const TypedInput = {
        async play() {
            const input = getInput();
            await userEvent.tab();
            await expect(input).toHaveFocus();
            await userEvent.clear(input);
            await userEvent.type(input, '12/25/2026{Enter}', { skipClick: true });
            await expect(input).toHaveValue('December 25, 2026');
            await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            await userEvent.clear(input);
            await userEvent.type(input, '31/02/2026', { skipClick: true });
            await userEvent.tab();
            await expect(input).toHaveValue('December 25, 2026');
        },
    };

    /** Empty text without a clear button: the input shows the value again. */
    const EmptyTextWithoutClearButton = {
        async play() {
            const input = getInput();
            await userEvent.tab();
            await userEvent.clear(input);
            await userEvent.keyboard('{Enter}');
            await expect(input).toHaveValue('November 12, 2026');
        },
    };

    /** Empty text with a clear button: the value is cleared. */
    const EmptyTextWithClearButton = {
        args: { clearButtonProps: { label: 'Clear' } },
        async play() {
            const input = getInput();
            await userEvent.tab();
            await userEvent.clear(input);
            await userEvent.keyboard('{Enter}');
            await expect(input).toHaveValue('');
            await userEvent.click(input);
            // No value: the roving day is today.
            const grid = await screen.findByRole('grid');
            await expect(within(grid).queryAllByRole('gridcell', { selected: true })).toHaveLength(0);
        },
    };

    /** The calendar grid layout: one row of 7 cells per week, each cell as large as a day button. */
    const CalendarGridLayout = {
        render: (args: any) => <DatePicker {...args} />,
        async play() {
            const grid = screen.getByRole('grid', { name: 'November 2026' });
            const rows = within(grid).getAllByRole('row');
            const day12 = screen.getByRole('gridcell', { name: dayName(day(2026, 11, 12)) });
            const { width, height } = day12.getBoundingClientRect();
            const rowSizes = rows.map((row) => {
                const box = row.getBoundingClientRect();
                return [box.width, box.height];
            });
            await expect(rowSizes).toEqual(rows.map(() => [width * 7, height]));
            // The week days header and the days are aligned in columns.
            const header = within(rows[0]).getAllByRole('columnheader')[4];
            await expect(header.getBoundingClientRect().left).toBe(day12.getBoundingClientRect().left);
            await expect(grid.closest(`.${CLASSNAME}`)).toBeInTheDocument();
        },
    };

    /** axe on the open dialog (combobox input, modal dialog, calendar grid). */
    const AccessibilityOpenDialog = {
        args: { minDate: day(2026, 11, 4), maxDate: day(2026, 11, 20) },
        parameters: A11Y_ERROR,
        async play() {
            await userEvent.click(getInput());
            await expectDayFocus(day(2026, 11, 12));
        },
    };

    /** axe on the standalone calendar. */
    const AccessibilityStandalone = {
        render: (args: any) => <DatePicker {...args} />,
        parameters: A11Y_ERROR,
    };

    return {
        meta,
        DialogTabOrder,
        DialogClose,
        KeyboardMonthEdges,
        KeyboardRangeEdges,
        TypedInput,
        EmptyTextWithoutClearButton,
        EmptyTextWithClearButton,
        CalendarGridLayout,
        AccessibilityOpenDialog,
        AccessibilityStandalone,
    };
}
