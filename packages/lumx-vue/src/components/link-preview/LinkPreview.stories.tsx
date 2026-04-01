import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/LinkPreview/Stories';
import { LinkPreview } from '.';

const { meta, ...stories } = setup({
    component: LinkPreview,
    decorators: { withNestedProps, withWrapper },
});

export default { title: 'LumX components/link-preview/Link preview', ...meta };

export const Default = { ...stories.Default };
export const TitleAndDescription = { ...stories.TitleAndDescription };
export const AllFields = { ...stories.AllFields };
export const Big = { ...stories.Big };
