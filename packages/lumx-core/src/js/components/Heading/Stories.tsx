import { headingElementArgType, HEADING_ELEMENTS } from '@lumx/core/stories/controls/element';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TEXT_ARG_TYPES } from '../Text/Stories';

/**
 * Setup Heading stories for a specific framework (React or Vue).
 * Framework-specific components (HeadingLevelProvider) are injected via `components`.
 */
export function setup({
    component: Heading,
    components: { HeadingLevelProvider },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { HeadingLevelProvider: any };
}>) {
    return {
        meta: {
            component: Heading,
            render: ({ children, ...args }: any) => <Heading {...args}>{children}</Heading>,
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
            render: () => (
                <>
                    <Heading>First level</Heading>
                    <HeadingLevelProvider>
                        <Heading>Second Level</Heading>
                        <HeadingLevelProvider>
                            <Heading>Third Level</Heading>
                            <Heading>Other Third Level</Heading>
                            <HeadingLevelProvider>
                                <Heading>Fourth Level</Heading>
                                <HeadingLevelProvider>
                                    <Heading>Fifth Level</Heading>
                                </HeadingLevelProvider>
                            </HeadingLevelProvider>
                        </HeadingLevelProvider>
                    </HeadingLevelProvider>
                </>
            ),
        },
    };
}
