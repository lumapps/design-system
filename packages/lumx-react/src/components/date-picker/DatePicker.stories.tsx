import { DatePicker, GridColumn } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

export default {
    title: 'LumX components/date-picker/DatePicker',
    component: DatePicker,
    argTypes: {
        onChange: { action: true },
    },
    decorators: [withValueOnChange(), withNestedProps()],
};

/**
 * Default date picker
 */
export const Default = {
    args: {
        defaultMonth: new Date('2023-02'),
        'nextButtonProps.label': 'Next month',
        'previousButtonProps.label': 'Previous month',
    },
};

/**
 * Demonstrate variations based on the given locale code
 */
export const LocalesVariations = {
    ...Default,
    decorators: [
        withCombinations({
            combinations: { sections: { key: 'locale', options: ['fr', 'en-US', 'ar', 'zh-HK', 'ar-eg'] } },
        }),
        withWrapper({ maxColumns: 5, itemMinWidth: 300 }, GridColumn),
    ],
};
