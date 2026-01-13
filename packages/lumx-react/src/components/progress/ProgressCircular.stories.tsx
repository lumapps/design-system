import { ProgressCircular, ProgressCircularSize, Size, Text } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const sizes: Array<ProgressCircularSize> = [Size.xxs, Size.xs, Size.s, Size.m];

export default {
    title: 'LumX components/progress/ProgressCircular',
    component: ProgressCircular,
    args: ProgressCircular.defaultProps,
    argTypes: {
        size: getSelectArgType<ProgressCircularSize>(sizes),
    },
};

/**
 * Default progress circular
 */
export const Default = {};

/**
 * All sizes
 */
export const AllSizes = {
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'size', options: sizes } },
        }),
    ],
};

/**
 * Inline display variant to use inside text
 */
export const Inline = {
    render() {
        return (
            <Text as="p">
                Some text with <ProgressCircular display="inline" size="xxs" /> inline progress
            </Text>
        );
    },
};
