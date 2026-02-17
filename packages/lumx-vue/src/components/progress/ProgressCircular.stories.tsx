import { ProgressCircular, Text } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/ProgressCircular/Stories';

const { meta, ...stories } = setup({
    component: ProgressCircular,
    decorators: { withCombinations },
    overrides: {
        Inline: {
            render() {
                return (
                    <Text as="p">
                        Some text with <ProgressCircular display="inline" size="xxs" /> inline progress
                    </Text>
                );
            },
        },
    },
});

export default {
    title: 'LumX components/progress/ProgressCircular',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllSizes = { ...stories.AllSizes };
export const Inline = { ...stories.Inline };
