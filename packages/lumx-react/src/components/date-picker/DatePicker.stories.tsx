import { DatePicker, GridColumn } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withTheming } from '@lumx/react/stories/decorators/withTheming';
import { setup } from '@lumx/core/js/components/DatePicker/Stories';

const { meta, ...stories } = setup({
    component: DatePicker,
    components: { GridColumn },
    decorators: { withValueOnChange, withNestedProps, withCombinations, withWrapper, withTheming },
});

export default {
    title: 'LumX components/date-picker/DatePicker',
    ...meta,
};

export const Default = { ...stories.Default };
export const LocalesVariations = { ...stories.LocalesVariations };
export const Theming = { ...stories.Theming };
