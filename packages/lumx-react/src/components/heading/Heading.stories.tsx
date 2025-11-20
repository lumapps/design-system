import { headingElementArgType, HEADING_ELEMENTS } from '@lumx/react/stories/controls/element';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { ALL_TYPOGRAPHY } from '@lumx/react/stories/controls/typography';
import { Heading, HeadingLevelProvider } from '.';
import TextStories from '../text/Text.stories';

export default {
    title: 'LumX components/heading/Heading',
    component: Heading,
    args: Heading.defaultProps,
    argTypes: {
        ...TextStories.argTypes,
        as: headingElementArgType,
        children: { control: 'text' },
    },
};

/**
 * Default heading with text
 */
export const Default = {
    args: { children: 'Some heading text' },
};

/**
 * All supported heading elements
 */
export const AllLevels = {
    ...Default,
    argTypes: { as: { control: false } },
    decorators: [withCombinations({ combinations: { rows: { key: 'as', options: HEADING_ELEMENTS } } })],
};

/**
 * All typography
 */
export const AllTypography = {
    ...Default,
    argTypes: { typography: { control: false } },
    decorators: [withCombinations({ combinations: { rows: { key: 'typography', options: ALL_TYPOGRAPHY } } })],
};

/**
 * Nest HeadingLevelProvider to increment heading levels
 */
export const NestedHeadingLevelProvider = () => (
    <>
        {/* This will render a h1 */}
        <Heading>First level</Heading>
        <HeadingLevelProvider>
            {/* This will render a h2 */}
            <Heading>Second Level</Heading>
            <HeadingLevelProvider>
                {/* This will render a h3 */}
                <Heading>Third Level</Heading>
                {/* This will also render a h3 */}
                <Heading>Other Third Level</Heading>
                <HeadingLevelProvider>
                    {/* This will render a h4 */}
                    <Heading>Fourth Level</Heading>
                    <HeadingLevelProvider>
                        {/* This will render a h5 */}
                        <Heading>Fifth Level</Heading>
                    </HeadingLevelProvider>
                </HeadingLevelProvider>
            </HeadingLevelProvider>
        </HeadingLevelProvider>
    </>
);
