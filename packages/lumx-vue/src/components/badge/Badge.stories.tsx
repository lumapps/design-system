import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Badge/Stories';
import { Badge, Icon, Thumbnail, FlexBox } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Badge,
    components: { Icon, Thumbnail, FlexBox },
    decorators: { withCombinations },
});

export default { title: 'LumX components/badge/Badge', ...meta };

export const WithText = { ...stories.WithText };
export const WithIcon = { ...stories.WithIcon };
export const WithThumbnail = { ...stories.WithThumbnail };
export const AllColors = { ...stories.AllColors };
