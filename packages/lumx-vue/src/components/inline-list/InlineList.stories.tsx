import { Icon, InlineList, Text } from '@lumx/vue';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/InlineList/Stories';

const { meta, ...stories } = setup({
    component: InlineList,
    components: { Text, Icon },
    decorators: { withResizableBox },
});

export default { title: 'LumX components/inline-list/InlineList', ...meta };

export const WithElements = { ...stories.WithElements };
export const MixedNoWrapAndTruncate = { ...stories.MixedNoWrapAndTruncate };
export const Wrap = { ...stories.Wrap };
