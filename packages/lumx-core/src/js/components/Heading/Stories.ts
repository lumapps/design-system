import { headingElementArgType, HEADING_ELEMENTS } from '@lumx/core/stories/controls/element';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TEXT_ARG_TYPES } from '../Text/Stories';

/**
 * Setup Heading stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'NestedHeadingLevelProvider';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                ...TEXT_ARG_TYPES,
                as: headingElementArgType,
                children: { control: 'text' },
            },
        },

        /** Default heading with text */
        Default: {
            args: { children: 'Some heading text' },
        },

        /** All supported heading elements */
        AllLevels: {
            args: { children: 'Some heading text' },
            argTypes: { as: { control: false } },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'as', options: HEADING_ELEMENTS },
                    },
                }),
            ],
        },

        /** All typography */
        AllTypography: {
            args: { children: 'Some heading text' },
            argTypes: { typography: { control: false } },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'typography', options: ALL_TYPOGRAPHY },
                    },
                }),
            ],
        },

        /** Nest HeadingLevelProvider to increment heading levels */
        NestedHeadingLevelProvider: {
            ...overrides.NestedHeadingLevelProvider,
        },
    };
}
