import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Heading/Stories';

import { Heading, HeadingLevelProvider } from '.';

const { meta, Default, AllLevels, AllTypography, NestedHeadingLevelProvider } = setup({
    component: Heading,
    decorators: { withWrapper, withCombinations },
    overrides: {
        NestedHeadingLevelProvider: {
            render: () => (
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
            ),
        },
    },
});

export default {
    title: 'LumX components/heading/Heading',
    ...meta,
};

export { Default, AllLevels, AllTypography, NestedHeadingLevelProvider };
