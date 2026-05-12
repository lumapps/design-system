import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { vi } from 'vitest';

import { getTime } from '../../utils/time';

export const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the TimePickerField test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface TimePickerFieldTestSetup {
    components: {
        TimePickerField: any;
    };
    /**
     * Render a TimePickerField template with controlled state management.
     *
     * @param template    JSX render function receiving `{ value, onChange, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     */
    renderWithState: (template: (props: any) => any, initialArgs?: Record<string, any>) => RenderResult;
}

/** Asymmetric matcher for a Date with the given hour and minute (time-of-day). */
const expectTimeOfDay = (hours: number, minutes: number) =>
    expect.toSatisfy((d: unknown) => d instanceof Date && d.getHours() === hours && d.getMinutes() === minutes);

export function createTemplates(TimePickerField: any) {
    /** Default single time-picker template */
    const defaultTemplate = (props: any) => (
        <TimePickerField label="Start time" locale="en-US" translations={TRANSLATIONS} {...props} />
    );

    return { defaultTemplate };
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function timePickerFieldTests({ components, renderWithState }: TimePickerFieldTestSetup) {
    const { TimePickerField } = components;
    const { defaultTemplate } = createTemplates(TimePickerField);

    describe('Static rendering', () => {
        it('renders the field with the provided label', () => {
            renderWithState(defaultTemplate, { label: 'Start' });
            expect(screen.getByRole('combobox', { name: 'Start' })).toBeInTheDocument();
        });

        it('displays the formatted current value', () => {
            renderWithState(defaultTemplate, { value: getTime(14, 30) });
            // en-US short time. Node ICU may use a narrow no-break space (U+202F) between time and AM/PM.
            const inputValue = (screen.getByRole('combobox') as HTMLInputElement).value;
            expect(inputValue).toMatch(/^2:30/);
            expect(inputValue.toUpperCase()).toContain('PM');
        });
    });

    describe('option list', () => {
        it('builds 48 entries for the default 30-minute step', async () => {
            renderWithState(defaultTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            expect(screen.queryAllByRole('option')).toHaveLength(48);
        });

        it('honours `step=15`', async () => {
            renderWithState(defaultTemplate, { step: 15 });
            await userEvent.click(screen.getByRole('combobox'));
            expect(screen.queryAllByRole('option')).toHaveLength(96);
        });

        it('keeps options before `minTime` visible but disables them', async () => {
            renderWithState(defaultTemplate, { minTime: getTime(10, 0) });
            await userEvent.click(screen.getByRole('combobox'));
            const options = screen.queryAllByRole('option');
            // Full 48-entry list is still rendered.
            expect(options).toHaveLength(48);
            // Find option for 9:30 → must be disabled. 10:00 → enabled.
            const optBefore = options.find((o) => /9:30/.test(o.textContent ?? ''));
            const optAfter = options.find((o) => /10:00/.test(o.textContent ?? ''));
            expect(optBefore).toHaveAttribute('aria-disabled', 'true');
            expect(optAfter).not.toHaveAttribute('aria-disabled', 'true');
        });

        it('keeps options after `maxTime` visible but disables them', async () => {
            renderWithState(defaultTemplate, { maxTime: getTime(1, 0) });
            await userEvent.click(screen.getByRole('combobox'));
            const options = screen.queryAllByRole('option');
            expect(options).toHaveLength(48);
            // 1:00 enabled, 1:30 disabled.
            const optAt = options.find((o) => /1:00/.test(o.textContent ?? ''));
            const optAfter = options.find((o) => /1:30/.test(o.textContent ?? ''));
            expect(optAt).not.toHaveAttribute('aria-disabled', 'true');
            expect(optAfter).toHaveAttribute('aria-disabled', 'true');
        });
    });

    describe('typed input parsing', () => {
        it('parses a typed time on blur and emits the new Date', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: getTime(8, 0), onChange });
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.clear(input);
            await userEvent.type(input, '10:30');
            // Blur the input.
            await userEvent.tab();
            expect(onChange).toHaveBeenLastCalledWith(expectTimeOfDay(10, 30), undefined, undefined);
        });

        it('snaps to `minTime` when the typed input is below it', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, {
                value: getTime(13, 0),
                minTime: getTime(12, 0),
                onChange,
            });
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.clear(input);
            await userEvent.type(input, '9');
            await userEvent.tab();
            expect(onChange).toHaveBeenLastCalledWith(expectTimeOfDay(12, 0), undefined, undefined);
        });

        it('does not call onChange for an unparseable typed value', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: getTime(8, 0), onChange });
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await userEvent.clear(input);
            await userEvent.type(input, 'xyz');
            await userEvent.tab();
            // The implicit `clear` may emit `onChange(undefined, ...)`, but no Date should ever be emitted.
            expect(onChange).not.toHaveBeenCalledWith(expect.any(Date), undefined, undefined);
        });
    });

    describe('selection via click', () => {
        it('emits a Date matching the picked option time-of-day', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: getTime(8, 0), onChange });
            await userEvent.click(screen.getByRole('combobox'));
            // Match "8:00 PM" (any whitespace between time and AM/PM — ICU may use U+202F).
            const option = await screen.findByRole('option', { name: /^8:00\sPM$/i });
            await userEvent.click(option);
            expect(onChange).toHaveBeenLastCalledWith(expectTimeOfDay(20, 0), undefined, undefined);
        });
    });
}
