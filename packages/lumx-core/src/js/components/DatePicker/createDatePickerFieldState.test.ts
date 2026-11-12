// @vitest-environment jsdom
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { getCalendarDate } from '../../utils/date/calendarDay';
import { createDatePickerFieldState, type DatePickerFieldStateProps } from './createDatePickerFieldState';
import { describeInTimeZones } from '../../../testing/timeZones';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);
/** November 12, 2026 (made in the time zone of the test). */
let NOVEMBER_12: Date;

/**
 * Set up the field state on an input (no framework): `render` writes the view to the DOM like a wrapper would.
 * `props` can be changed between actions (the state reads the latest props).
 */
function setup(initialProps: Partial<DatePickerFieldStateProps> = {}, attributes = '') {
    document.body.innerHTML = `
        <label for="field">Date</label>
        <input id="field" role="combobox" aria-haspopup="dialog" ${attributes} />
        <button>After</button>`;
    const input = screen.getByRole('combobox', { name: 'Date' }) as HTMLInputElement;
    const onChange = vi.fn();
    const props: DatePickerFieldStateProps = { locale: 'en-US', name: 'date', onChange, ...initialProps };
    // Write the view to the DOM on each update, like a wrapper render.
    const onUpdate = vi.fn();
    const state = createDatePickerFieldState({ getProps: () => props, onUpdate });
    const render = () => {
        const view = state.getView();
        input.value = view.inputValue;
        input.setAttribute('aria-expanded', String(view.isOpen));
    };
    onUpdate.mockImplementation(render);
    render();
    const detach = state.attachInput(input);
    /** Replace the input text (typing), with the focus in the input. */
    const typeText = (text: string) => {
        input.focus();
        state.inputText(text);
    };
    return { input, props, state, render, onChange, detach, typeText };
}

describeInTimeZones('createDatePickerFieldState', () => {
    beforeEach(() => {
        NOVEMBER_12 = day(2026, 11, 12);
        // Reference date for the current year and the two-digit year window.
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2026, 10, 12, 15, 30));
    });
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    describe('input text', () => {
        it('should show the formatted value', () => {
            const { input } = setup({ value: NOVEMBER_12 });
            expect(input).toHaveValue('November 12, 2026');
        });

        it('should show the typed text until the commit', async () => {
            const { input, typeText, onChange } = setup({ value: NOVEMBER_12 });
            typeText('12/2');
            expect(input).toHaveValue('12/2');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should show the new value when the value changes', async () => {
            const { input, props, render, typeText } = setup({ value: NOVEMBER_12 });
            typeText('12/2');
            props.value = day(2026, 12, 25);
            render();
            expect(input).toHaveValue('December 25, 2026');
        });

        it('should format the value again when the locale changes', async () => {
            const { input, props, render, typeText } = setup({ value: NOVEMBER_12 });
            typeText('12/2');
            props.locale = 'fr-FR';
            render();
            expect(input).toHaveValue('12 novembre 2026');
        });
    });

    describe('open state', () => {
        it('should open on Down and Alt+Down', async () => {
            const { input, state } = setup();
            input.focus();
            await userEvent.keyboard('{ArrowDown}');
            expect(state.getView().isOpen).toBe(true);
            state.close();
            await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
            expect(state.getView().isOpen).toBe(true);
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });

        it('should stay open on Down when already open', async () => {
            const { input, state } = setup();
            await userEvent.click(input);
            await userEvent.keyboard('{ArrowDown}');
            expect(state.getView().isOpen).toBe(true);
        });

        it('should open on click, and close on click when open', async () => {
            const { input, state } = setup();
            await userEvent.click(input);
            expect(state.getView().isOpen).toBe(true);
            await userEvent.click(input);
            expect(state.getView().isOpen).toBe(false);
        });

        it('should not open on Enter, Space, other characters and Escape', async () => {
            const { input, state } = setup();
            input.focus();
            await userEvent.keyboard('{Enter}12 nov{Escape}');
            expect(state.getView().isOpen).toBe(false);
        });

        it.each([['disabled'], ['aria-disabled="true"'], ['readonly']])(
            'should not open when %s',
            async (attributes) => {
                const { input, state } = setup({}, attributes);
                await userEvent.click(input);
                input.focus();
                await userEvent.keyboard('{ArrowDown}');
                expect(state.getView().isOpen).toBe(false);
            },
        );

        it('should tear down the input behavior', async () => {
            const { input, state, detach } = setup();
            detach();
            await userEvent.click(input);
            expect(state.getView().isOpen).toBe(false);
        });
    });

    describe('focus element', () => {
        it('should keep the first roving day set while open, until the dialog closes', async () => {
            const { input, state } = setup();
            const first = document.createElement('button');
            const second = document.createElement('button');
            // Closed: not captured.
            state.setRovingDayElement(first);
            expect(state.getView().focusElement).toBeUndefined();

            await userEvent.click(input);
            state.setRovingDayElement(null);
            state.setRovingDayElement(first);
            state.setRovingDayElement(second);
            expect(state.getView().focusElement).toBe(first);

            state.close();
            expect(state.getView().focusElement).toBeUndefined();
            await userEvent.click(input);
            state.setRovingDayElement(second);
            expect(state.getView().focusElement).toBe(second);
        });
    });

    describe('day pick and clear', () => {
        it('should change and close on a day pick', async () => {
            const { input, state, onChange } = setup({ value: NOVEMBER_12 });
            await userEvent.click(input);
            state.pickDay(day(2026, 11, 3));
            expect(onChange).toHaveBeenCalledWith(day(2026, 11, 3), 'date');
            expect(state.getView().isOpen).toBe(false);
        });

        it('should change to undefined on clear', () => {
            const { state, onChange } = setup({ value: NOVEMBER_12 });
            state.clear();
            expect(onChange).toHaveBeenCalledWith(undefined, 'date');
        });
    });

    describe('commit', () => {
        /** Type a text, then commit it with Enter. */
        const typeAndEnter = async (text: string, props: Partial<DatePickerFieldStateProps> = {}) => {
            const field = setup(props);
            field.typeText(text);
            await userEvent.keyboard('{Enter}');
            return field;
        };

        it('should commit on Enter with the event, without opening', async () => {
            const { onChange, state } = await typeAndEnter('12/25/2026', { value: NOVEMBER_12 });
            expect(onChange).toHaveBeenCalledWith(day(2026, 12, 25), 'date', expect.any(KeyboardEvent));
            expect(state.getView().isOpen).toBe(false);
        });

        it('should commit on blur with the event', async () => {
            const { onChange, typeText } = setup({ value: NOVEMBER_12 });
            typeText('March 3, 85');
            await userEvent.tab();
            expect(onChange).toHaveBeenCalledWith(day(1985, 3, 3), 'date', expect.any(FocusEvent));
        });

        it('should give the time of day of a day pick (00:00 UTC) to a typed date', async () => {
            const { onChange } = await typeAndEnter('12/25/2026', { value: NOVEMBER_12 });
            expect(onChange.mock.calls[0][0].getUTCHours()).toBe(0);
        });

        it('should not change when the text is the formatted value', async () => {
            const { onChange } = await typeAndEnter('November 12, 2026', { value: NOVEMBER_12 });
            expect(onChange).not.toHaveBeenCalled();
            const empty = await typeAndEnter('');
            expect(empty.onChange).not.toHaveBeenCalled();
        });

        it('should not change for a valid date on the same day as the value', async () => {
            expect((await typeAndEnter('11/12/2026', { value: NOVEMBER_12 })).onChange).not.toHaveBeenCalled();
            // Same day, value with another time of day.
            const valueWithTime = new Date(2026, 10, 12, 18, 45);
            expect((await typeAndEnter('11/12/2026', { value: valueWithTime })).onChange).not.toHaveBeenCalled();
        });

        it('should snap a date out of the range to the range', async () => {
            const range = { value: NOVEMBER_12, minDate: day(2026, 11, 4), maxDate: day(2026, 11, 24) };
            expect((await typeAndEnter('1/1/2020', range)).onChange).toHaveBeenCalledWith(
                day(2026, 11, 4),
                'date',
                expect.any(KeyboardEvent),
            );
            expect((await typeAndEnter('1/1/2030', range)).onChange).toHaveBeenCalledWith(
                day(2026, 11, 24),
                'date',
                expect.any(KeyboardEvent),
            );
        });

        it('should snap with the time of day of a day pick (00:00 UTC)', async () => {
            const minDate = new Date(2026, 10, 4, 14, 30);
            const { onChange } = await typeAndEnter('1/1/2020', { minDate });
            expect(onChange.mock.calls[0][0]).toEqual(getCalendarDate(2026, 10, 4));
        });

        it('should not change when the snapped date is the same day as the value', async () => {
            const { onChange } = await typeAndEnter('1/1/2030', { value: NOVEMBER_12, maxDate: NOVEMBER_12 });
            expect(onChange).not.toHaveBeenCalled();
        });

        it.each([['hello'], ['2/31/2026'], ['12']])(
            'should show the value again on the invalid text %s',
            async (text) => {
                const { onChange, input } = await typeAndEnter(text, { value: NOVEMBER_12 });
                expect(onChange).not.toHaveBeenCalled();
                expect(input).toHaveValue('November 12, 2026');
            },
        );

        it('should clear on an empty text with a clear button', async () => {
            const clearButtonProps = { label: 'Clear' };
            const empty = await typeAndEnter('', { value: NOVEMBER_12, clearButtonProps });
            expect(empty.onChange).toHaveBeenCalledWith(undefined, 'date', expect.any(KeyboardEvent));
            const blank = await typeAndEnter('  ', { value: NOVEMBER_12, clearButtonProps });
            expect(blank.onChange).toHaveBeenCalledWith(undefined, 'date', expect.any(KeyboardEvent));
        });

        it('should show the value again on an empty text without a clear button', async () => {
            const { onChange, input } = await typeAndEnter('', { value: NOVEMBER_12 });
            expect(onChange).not.toHaveBeenCalled();
            expect(input).toHaveValue('November 12, 2026');
        });

        it('should show the value again when the consumer ignores onChange', async () => {
            const { onChange, input } = await typeAndEnter('12/25/2026', { value: NOVEMBER_12 });
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(input).toHaveValue('November 12, 2026');
        });
    });
});
