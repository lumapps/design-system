import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Badge/Stories';

import { Badge } from '@lumx/vue';
import BadgeDefaultVue from './Stories/BadgeDefault.vue';
import BadgeWithIconVue from './Stories/BadgeWithIcon.vue';

const { meta, ...stories } = setup({
    component: Badge,
    render: withRender({ BadgeDefaultVue }, '{{ args.children }}'),
    decorators: { withCombinations },
    overrides: {
        WithIcon: {
            render: withRender({ BadgeWithIconVue }),
        },
    },
});

export default {
    title: 'LumX components/badge/Badge',
    ...meta,
};

export const WithText = { ...stories.WithText };
export const WithIcon = { ...stories.WithIcon };
export const AllColors = { ...stories.AllColors };
