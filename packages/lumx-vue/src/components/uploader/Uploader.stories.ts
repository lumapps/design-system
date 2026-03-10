import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Uploader/Stories';
import { GridColumn, Uploader } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Uploader,
    components: { GridColumn },
    decorators: { withCombinations, withWrapper },
});

export default { title: 'LumX components/uploader/Uploader', ...meta };

export const WithLabel = { ...stories.WithLabel };
export const WithLabelAndIcon = { ...stories.WithLabelAndIcon };
export const Variants = { ...stories.Variants };
export const RatioAndSize = { ...stories.RatioAndSize };
