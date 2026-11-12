import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/dom';
import { vi } from 'vitest';

import { describeInTimeZones } from '../../../testing/timeZones';
import { getCalendarDate, getDateKey } from '../../utils/date/calendarDay';
import { CLASSNAME } from './constants';

/** Month button props (required props of both components). */
export const MONTH_BUTTON_PROPS = {
    nextButtonProps: { label: 'Next month' },
    previousButtonProps: { label: 'Previous month' },
};

type RenderResult = {
    unmount: () => void;
    container: HTMLElement;
    /** Merge new args into the render args (`value` excluded) and wait for the update. */
    setArgs: (args: Record<string, any>) => Promise<void>;
};

/**
 * Options to set up the date picker test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface DatePickerTestSetup {
    components: {
        DatePicker: any;
        DatePickerField: any;
    };
    /**
     * Render a template with a controlled `value` state, updated by `onChange` (then calls `initialArgs.onChange`
     * with the first argument, the new value). The other args can be changed with `setArgs`.
     *
     * @param template    JSX render function receiving `{ value, onChange, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     */
    renderWithState: (template: (props: any) => any, initialArgs?: Record<string, any>) => RenderResult;
}

/** Calendar date, the date of a day pick (month is 1-based for readability). */
export const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

/** Format a date as the accessible name of its day button. */
const dayName = (date: Date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

/** The day button of a date. */
const getDay = (date: Date) => screen.getByRole('gridcell', { name: dayName(date) });

/** The first argument of the last call of a spy. */
const lastValue = (spy: ReturnType<typeof vi.fn>) => spy.mock.calls[spy.mock.calls.length - 1]?.[0];

export function createTemplates({ DatePicker, DatePickerField }: DatePickerTestSetup['components']) {
    /** Standalone calendar (`en-US`: Sunday first). */
    const pickerTemplate = (props: any) => <DatePicker locale="en-US" {...MONTH_BUTTON_PROPS} {...props} />;

    /** Date field (`en-US`). */
    const fieldTemplate = (props: any) => (
        <DatePickerField label="Date" name="date" locale="en-US" {...MONTH_BUTTON_PROPS} {...props} />
    );

    return { pickerTemplate, fieldTemplate };
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function datePickerTests({ components, renderWithState }: DatePickerTestSetup) {
    const { pickerTemplate, fieldTemplate } = createTemplates(components);

    describe('DatePicker', () => {
        // November 2026 (Sunday first): row 1 = 1 to 7, row 5 = 29, 30 and blank cells.
        const NOVEMBER_12 = day(2026, 11, 12);

        describe('markup', () => {
            it('should render a grid labelled by the month label', () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                const grid = screen.getByRole('grid', { name: 'November 2026' });
                const monthLabel = document.getElementById(grid.getAttribute('aria-labelledby') as string);
                expect(monthLabel).toHaveAttribute('dir', 'auto');
                expect(monthLabel).toHaveClass('visually-hidden');
                expect(within(grid).getAllByRole('columnheader')).toHaveLength(7);
                expect(within(grid).getByRole('columnheader', { name: 'Sunday' })).toBeInTheDocument();
                expect(grid.querySelectorAll('span.visually-hidden[dir="auto"]')).toHaveLength(0);
            });

            it('should render the days as gridcell buttons and the blank cells as empty gridcells', () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                const grid = screen.getByRole('grid');
                const rows = within(grid).getAllByRole('row');
                // Header row + 6 week rows.
                expect(rows).toHaveLength(7);
                const cells = within(rows[5]).getAllByRole('gridcell');
                expect(cells).toHaveLength(7);
                expect(cells[0].tagName).toBe('BUTTON');
                expect(cells[0]).toHaveAttribute('data-date', '2026-11-29');
                expect(cells[0]).toHaveClass(`${CLASSNAME}__month-day`);
                expect(cells[2].tagName).toBe('DIV');
                expect(cells[2]).toBeEmptyDOMElement();
            });

            it('should mark the selected day and the roving day', () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                expect(getDay(NOVEMBER_12)).toHaveAttribute('aria-selected', 'true');
                expect(getDay(NOVEMBER_12)).toHaveAttribute('tabindex', '0');
                expect(getDay(day(2026, 11, 13))).not.toHaveAttribute('aria-selected');
                expect(getDay(day(2026, 11, 13))).toHaveAttribute('tabindex', '-1');
                expect(screen.getByRole('grid').querySelectorAll('[tabindex="0"]')).toHaveLength(1);
            });

            it('should mark today with aria-current="date"', () => {
                const today = new Date();
                renderWithState(pickerTemplate, { defaultMonth: today });
                const todayButton = screen.getByRole('grid').querySelector(`[data-date="${getDateKey(today)}"]`);
                expect(todayButton).toHaveAttribute('aria-current', 'date');
                expect(todayButton).toHaveClass(`${CLASSNAME}__month-day--is-today`);
                expect(screen.getByRole('grid').querySelectorAll('[aria-current]')).toHaveLength(1);
            });

            it('should disable the days out of the range', () => {
                renderWithState(pickerTemplate, {
                    value: NOVEMBER_12,
                    minDate: day(2026, 11, 4),
                    maxDate: day(2026, 11, 20),
                });
                expect(getDay(day(2026, 11, 3))).toBeDisabled();
                expect(getDay(day(2026, 11, 4))).toBeEnabled();
                expect(getDay(day(2026, 11, 20))).toBeEnabled();
                expect(getDay(day(2026, 11, 21))).toBeDisabled();
            });

            it('should forward the class name and the theme to the root', () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12, className: 'custom', theme: 'dark' });
                const root = screen.getByRole('grid').closest(`.${CLASSNAME}`);
                expect(root).toHaveClass('custom');
                expect(root).toHaveClass(`${CLASSNAME}--theme-dark`);
            });

            it('should not move focus on mount', () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                expect(document.body).toHaveFocus();
            });
        });

        describe('month buttons', () => {
            it('should change the month, keep the focus and move the roving day to the same day number', async () => {
                renderWithState(pickerTemplate, { value: day(2026, 10, 31) });
                const next = screen.getByRole('button', { name: 'Next month' });
                await userEvent.click(next);
                expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
                expect(next).toHaveFocus();
                // October 31 => November 30 (last day).
                expect(getDay(day(2026, 11, 30))).toHaveAttribute('tabindex', '0');
                // Tab enters the grid on the roving day.
                await userEvent.tab();
                expect(getDay(day(2026, 11, 30))).toHaveFocus();

                const previous = screen.getByRole('button', { name: 'Previous month' });
                await userEvent.click(previous);
                await userEvent.click(previous);
                expect(screen.getByRole('grid', { name: 'September 2026' })).toBeInTheDocument();
                expect(previous).toHaveFocus();
                expect(getDay(day(2026, 9, 30))).toHaveAttribute('tabindex', '0');
            });

            it('should announce the month label only after a month change', async () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                const getMonthLabel = () =>
                    document.getElementById(screen.getByRole('grid').getAttribute('aria-labelledby') as string);
                expect(getMonthLabel()).not.toHaveAttribute('aria-live');
                await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
                expect(getMonthLabel()).toHaveTextContent('December 2026');
                expect(getMonthLabel()).toHaveAttribute('aria-live', 'polite');
            });
        });

        describe('year input', () => {
            it('should show the year of the shown month and commit a typed year on Enter and on blur', async () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                const year = screen.getByRole('spinbutton');
                expect(year).toHaveValue(2026);
                await userEvent.clear(year);
                await userEvent.type(year, '2019{Enter}');
                expect(screen.getByRole('grid', { name: 'November 2019' })).toBeInTheDocument();
                await userEvent.clear(year);
                await userEvent.type(year, '2031');
                // Not committed while typing.
                expect(screen.getByRole('grid', { name: 'November 2019' })).toBeInTheDocument();
                await userEvent.tab();
                expect(screen.getByRole('grid', { name: 'November 2031' })).toBeInTheDocument();
                expect(year).toHaveValue(2031);
            });

            it('should accept the years from 1 to 9999 only', async () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                const year = screen.getByRole('spinbutton');
                for (const text of ['0', '10000', '']) {
                    // eslint-disable-next-line no-await-in-loop
                    await userEvent.clear(year);
                    // eslint-disable-next-line no-await-in-loop
                    if (text) await userEvent.type(year, text);
                    // eslint-disable-next-line no-await-in-loop
                    await userEvent.keyboard('{Enter}');
                    // The invalid year is dropped and the shown year comes back.
                    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
                    expect(year).toHaveValue(2026);
                }
                await userEvent.clear(year);
                await userEvent.type(year, '9999{Enter}');
                expect(screen.getByRole('grid', { name: 'November 9999' })).toBeInTheDocument();
                await userEvent.clear(year);
                await userEvent.type(year, '1{Enter}');
                expect(year).toHaveValue(1);
                expect(screen.getByRole('grid').querySelector('[data-date="0001-11-01"]')).toBeInTheDocument();
            });
        });

        describe('keyboard', () => {
            it('should move by day and by week', async () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                getDay(NOVEMBER_12).focus();
                await userEvent.keyboard('{ArrowRight}');
                expect(getDay(day(2026, 11, 13))).toHaveFocus();
                expect(getDay(day(2026, 11, 13))).toHaveAttribute('tabindex', '0');
                await userEvent.keyboard('{ArrowDown}');
                expect(getDay(day(2026, 11, 20))).toHaveFocus();
                await userEvent.keyboard('{ArrowLeft}{ArrowUp}');
                expect(getDay(day(2026, 11, 12))).toHaveFocus();
            });

            it('should move to the first and last day of the week row', async () => {
                renderWithState(pickerTemplate, { value: NOVEMBER_12 });
                getDay(NOVEMBER_12).focus();
                await userEvent.keyboard('{Home}');
                expect(getDay(day(2026, 11, 8))).toHaveFocus();
                await userEvent.keyboard('{End}');
                expect(getDay(day(2026, 11, 14))).toHaveFocus();
            });

            it('should cross the month edges', async () => {
                renderWithState(pickerTemplate, { value: day(2026, 11, 30) });
                getDay(day(2026, 11, 30)).focus();
                await userEvent.keyboard('{ArrowRight}');
                expect(await screen.findByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
                await waitFor(() => expect(getDay(day(2026, 12, 1))).toHaveFocus());
                await userEvent.keyboard('{ArrowUp}');
                expect(await screen.findByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
                await waitFor(() => expect(getDay(day(2026, 11, 24))).toHaveFocus());
            });

            it('should move by month and by year with Page Up and Page Down', async () => {
                renderWithState(pickerTemplate, { value: day(2026, 1, 31) });
                getDay(day(2026, 1, 31)).focus();
                await userEvent.keyboard('{PageDown}');
                await waitFor(() => expect(getDay(day(2026, 2, 28))).toHaveFocus());
                await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
                await waitFor(() => expect(getDay(day(2025, 2, 28))).toHaveFocus());
                expect(screen.getByRole('grid', { name: 'February 2025' })).toBeInTheDocument();
            });

            it('should not move to a day out of the range', async () => {
                // maxDate is Friday 20: Down on Tuesday 17 targets Tuesday 24.
                renderWithState(pickerTemplate, { value: day(2026, 11, 17), maxDate: day(2026, 11, 20) });
                getDay(day(2026, 11, 17)).focus();
                await userEvent.keyboard('{ArrowDown}');
                expect(getDay(day(2026, 11, 17))).toHaveFocus();
                await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{PageDown}');
                expect(getDay(day(2026, 11, 20))).toHaveFocus();
                expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
            });
        });

        it('should warn and show the current month on an invalid date', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            renderWithState(pickerTemplate, { value: new Date('invalid') });
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid date provided'));
            const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            expect(screen.getByRole('grid', { name: currentMonth })).toBeInTheDocument();
            warn.mockRestore();
        });

        describeInTimeZones('range edges with a local time of day', () => {
            it('should disable the days out of the range', () => {
                // Local end of day and local midnight (not calendar dates): a time comparison would fail in a zone.
                renderWithState(pickerTemplate, {
                    value: day(2026, 11, 12),
                    minDate: new Date(2026, 10, 4, 23, 30),
                    maxDate: new Date(2026, 10, 20),
                });
                expect(getDay(day(2026, 11, 3))).toBeDisabled();
                expect(getDay(day(2026, 11, 4))).toBeEnabled();
                expect(getDay(day(2026, 11, 20))).toBeEnabled();
                expect(getDay(day(2026, 11, 21))).toBeDisabled();
            });
        });

        it('should call onChange with the date of a day pick', async () => {
            const onChange = vi.fn();
            renderWithState(pickerTemplate, { value: NOVEMBER_12, onChange });
            await userEvent.click(getDay(day(2026, 11, 3)));
            expect(lastValue(onChange)).toEqual(day(2026, 11, 3));
            expect(getDay(day(2026, 11, 3))).toHaveAttribute('aria-selected', 'true');
        });
    });

    describe('DatePickerField', () => {
        const NOVEMBER_12 = day(2026, 11, 12);
        const getInput = () => screen.getByRole('combobox', { name: 'Date' });

        describe('input', () => {
            it('should render an editable combobox with a dialog popup', () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12 });
                const input = getInput();
                expect(input).toHaveAttribute('aria-haspopup', 'dialog');
                expect(input).toHaveAttribute('aria-expanded', 'false');
                expect(input).toHaveAttribute('aria-controls');
                expect(input).not.toHaveAttribute('readonly');
                expect(input).not.toHaveAttribute('aria-autocomplete');
                expect(input).toHaveValue('November 12, 2026');
            });

            it('should open on click and focus the selected day', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12 });
                await userEvent.click(getInput());
                const dialog = await screen.findByRole('dialog', { name: 'Date' });
                expect(dialog).toHaveAttribute('aria-modal', 'true');
                expect(dialog.id).toBe(getInput().getAttribute('aria-controls'));
                expect(getInput()).toHaveAttribute('aria-expanded', 'true');
                await waitFor(() => expect(getDay(NOVEMBER_12)).toHaveFocus());
            });

            it('should open on Down and on Alt+Down', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12 });
                getInput().focus();
                await userEvent.keyboard('{ArrowDown}');
                expect(await screen.findByRole('dialog')).toBeInTheDocument();
                await userEvent.keyboard('{Escape}');
                await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
                expect(getInput()).toHaveFocus();
                await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
                expect(await screen.findByRole('dialog')).toBeInTheDocument();
            });

            it('should not open on Enter and Space', async () => {
                renderWithState(fieldTemplate, {});
                getInput().focus();
                await userEvent.keyboard('{Enter} ');
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });

            it('should not open when disabled', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12, isDisabled: true });
                expect(getInput()).toBeDisabled();
                await userEvent.click(getInput());
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });

            it('should not open when aria-disabled', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12, 'aria-disabled': true });
                expect(getInput()).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(getInput());
                await userEvent.keyboard('{ArrowDown}');
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });

            it('should ignore readOnly (the input stays editable and opens)', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12, readOnly: true });
                expect(getInput()).not.toHaveAttribute('readonly');
                await userEvent.click(getInput());
                expect(await screen.findByRole('dialog')).toBeInTheDocument();
            });

            it('should format the value again when the locale changes', async () => {
                const { setArgs } = renderWithState(fieldTemplate, { value: NOVEMBER_12 });
                expect(getInput()).toHaveValue('November 12, 2026');
                await setArgs({ locale: 'fr' });
                expect(getInput()).toHaveValue('12 novembre 2026');
            });

            it('should name the dialog with the field aria-label when there is no label', async () => {
                renderWithState(fieldTemplate, { label: undefined, 'aria-label': 'Publication date' });
                await userEvent.click(screen.getByRole('combobox', { name: 'Publication date' }));
                expect(await screen.findByRole('dialog', { name: 'Publication date' })).toBeInTheDocument();
            });
        });

        it('should pick a day, close the dialog and focus the input', async () => {
            const onChange = vi.fn();
            renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange });
            await userEvent.click(getInput());
            await userEvent.click(await screen.findByRole('gridcell', { name: dayName(day(2026, 11, 3)) }));
            expect(lastValue(onChange)).toEqual(day(2026, 11, 3));
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            expect(getInput()).toHaveValue('November 3, 2026');
            await waitFor(() => expect(getInput()).toHaveFocus());
        });

        it('should follow a key move into another month, then focus the selected day on the next open', async () => {
            renderWithState(fieldTemplate, { value: day(2026, 11, 30) });
            await userEvent.click(getInput());
            await waitFor(() => expect(getDay(day(2026, 11, 30))).toHaveFocus());
            await userEvent.keyboard('{ArrowRight}');
            expect(await screen.findByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
            await waitFor(() => expect(getDay(day(2026, 12, 1))).toHaveFocus());
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
            await userEvent.click(getInput());
            expect(await screen.findByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
            await waitFor(() => expect(getDay(day(2026, 11, 30))).toHaveFocus());
        });

        describe('typed input', () => {
            /** Replace the input text (no click: a click opens the dialog). */
            const replaceText = async (text: string) => {
                const input = getInput();
                input.focus();
                await userEvent.clear(input);
                if (text) await userEvent.type(input, text, { skipClick: true });
            };

            /** Replace the input text, then commit with Enter. */
            const typeAndEnter = async (text: string) => {
                await replaceText(text);
                await userEvent.keyboard('{Enter}');
            };

            it('should commit a typed date on Enter', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange });
                await typeAndEnter('12/25/2026');
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(lastValue(onChange)).toEqual(day(2026, 12, 25));
                expect(getInput()).toHaveValue('December 25, 2026');
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            });

            it('should commit a typed date on blur and call onBlur', async () => {
                const onChange = vi.fn();
                const onBlur = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange, onBlur });
                await replaceText('March 3, 85');
                await userEvent.tab();
                expect(lastValue(onChange)).toEqual(day(1985, 3, 3));
                expect(onBlur).toHaveBeenCalled();
                expect(getInput()).toHaveValue('March 3, 1985');
            });

            it('should not call onChange for the same day', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange });
                await typeAndEnter('11/12/26');
                expect(onChange).not.toHaveBeenCalled();
                expect(getInput()).toHaveValue('November 12, 2026');
            });

            it('should snap a date out of the range', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange, maxDate: day(2026, 11, 20) });
                await typeAndEnter('1/1/2030');
                expect(lastValue(onChange)).toEqual(day(2026, 11, 20));
                expect(getInput()).toHaveValue('November 20, 2026');
            });

            it('should show the value again on an invalid text', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange });
                await typeAndEnter('31/02/2026');
                expect(onChange).not.toHaveBeenCalled();
                expect(getInput()).toHaveValue('November 12, 2026');
            });

            it('should show the value again when the consumer ignores onChange', async () => {
                const onChange = vi.fn();
                renderWithState((props: any) => fieldTemplate({ ...props, value: NOVEMBER_12 }), { onChange });
                await typeAndEnter('12/25/2026');
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(getInput()).toHaveValue('November 12, 2026');
            });

            it('should clear on an empty text with a clear button', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, {
                    value: NOVEMBER_12,
                    onChange,
                    clearButtonProps: { label: 'Clear' },
                });
                await typeAndEnter('');
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(lastValue(onChange)).toBeUndefined();
                expect(getInput()).toHaveValue('');
            });

            it('should show the value again on an empty text without a clear button', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange });
                await typeAndEnter('');
                expect(onChange).not.toHaveBeenCalled();
                expect(getInput()).toHaveValue('November 12, 2026');
            });

            it('should not call onChange while typing', async () => {
                const onChange = vi.fn();
                renderWithState(fieldTemplate, { value: NOVEMBER_12, onChange, clearButtonProps: { label: 'Clear' } });
                await replaceText('12/2');
                expect(onChange).not.toHaveBeenCalled();
            });

            it('should open the calendar on the typed month on the next open', async () => {
                renderWithState(fieldTemplate, { value: NOVEMBER_12 });
                await typeAndEnter('2/14/2027');
                await userEvent.click(getInput());
                expect(await screen.findByRole('grid', { name: 'February 2027' })).toBeInTheDocument();
                await waitFor(() => expect(getDay(day(2027, 2, 14))).toHaveFocus());
            });
        });
    });
}
