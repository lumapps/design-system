import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withTheming } from '@lumx/vue/stories/decorators/withTheming';
import { setup } from '@lumx/core/js/components/DatePicker/Stories';

import { GridColumn } from '../grid-column';
import { DatePicker } from '.';

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
