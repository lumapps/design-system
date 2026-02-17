import { Icon, Text, GridColumn } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Icon/Stories';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';

const { meta, ...stories } = setup({
    component: Icon,
    components: { Text, GridColumn },
    decorators: { withCombinations, withWrapper },
});

export default {
    title: 'LumX components/icon/Icon',
    ...meta,
};

export const SizeAndShape = { ...stories.SizeAndShape };
export const AllColors = { ...stories.AllColors };
export const InsideText = { ...stories.InsideText };
