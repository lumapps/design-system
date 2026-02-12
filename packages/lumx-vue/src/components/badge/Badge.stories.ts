import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Badge/Stories';
import { mdiHeart } from '@lumx/icons';
import { ColorPalette } from '@lumx/core/js/constants';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

import { Badge, Icon } from '@lumx/vue';
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

/**
 * All combinations of colors and children types
 * NOTE: Only shows 'With text' row. 'With icon' variant is shown in separate WithIcon story above.
 * NOTE: 'With thumbnail' not included because Thumbnail component is not yet migrated to @lumx/vue
 */
export const AllColors = { ...stories.AllColors };
