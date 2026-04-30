import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { getDateAtTime } from '../../utils/time';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

/**
 * Setup TimePickerField stories for a specific framework (React or Vue).
 *
 * The framework wrapper (`TimePickerField`) is fully self-contained — it builds
 * its option list from `step`/`minTime`/`maxTime`/`locale` internally — so each
 * story is just an args object with optional render override.
 */
export function setup({
    component: TimePickerField,
    decorators: { withValueOnChange, withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withCombinations';
}>) {
    const meta = {
        component: TimePickerField,
        args: {
            label: 'Time',
            locale: 'en-US',
            translations: TRANSLATIONS,
        },
        decorators: [withValueOnChange()],
    };

    /** Empty field with the default 30-minute step. */
    const Default = {};

    /** Field with a default value already selected. */
    const WithValue = {
        args: {
            value: getDateAtTime({ hour: 12, minute: 30 }),
        },
    };

    /** 15-minute interval — produces 96 entries. */
    const Step15 = {
        args: {
            step: 15,
        },
    };

    /** Disables (but keeps visible) options before 12:00. */
    const WithMinTime = {
        args: {
            minTime: getDateAtTime({ hour: 2, minute: 0 }),
        },
    };

    /** Disables (but keeps visible) options after 18:00. */
    const WithMaxTime = {
        args: {
            maxTime: getDateAtTime({ hour: 18, minute: 0 }),
        },
    };

    /** French locale → 24-hour formatting. */
    const French = {
        args: {
            locale: 'fr-FR',
            value: getDateAtTime({ hour: 14, minute: 30 }),
        },
    };

    /** Disabled states (matrix). */
    const Disabled = {
        args: WithValue.args,
        decorators: [
            withCombinations({
                combinations: {
                    rows: {
                        isDisabled: { isDisabled: true },
                        'aria-disabled': { 'aria-disabled': true },
                    },
                },
            }),
        ],
    };

    return { meta, Default, WithValue, Step15, WithMinTime, WithMaxTime, French, Disabled };
}
