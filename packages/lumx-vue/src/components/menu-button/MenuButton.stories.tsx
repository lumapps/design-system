import { setup } from '@lumx/core/js/components/Menu/MenuButtonStories';

import { MenuItem, MenuDivider, MenuButton } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';

import StoryWithLinkItems from './Stories/WithLinkItems.vue';

const { meta, ...stories } = setup({
    components: { MenuButton, MenuItem, MenuDivider },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/menu-button/MenuButton',
    ...meta,
};

/** Default menu button config */
export const Default = { ...stories.Default };

/** All MenuButton variants */
export const Variants = { ...stories.Variants };

/** Menu with link items */
export const WithLinkItems = {
    ...stories.WithLinkItems,
    render: (args: any) => () => <StoryWithLinkItems {...args} />,
};
