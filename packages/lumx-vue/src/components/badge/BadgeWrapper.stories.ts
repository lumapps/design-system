import { BadgeWrapper } from '@lumx/vue';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Badge/BadgeWrapperStories';
import BadgeWrapperWithIconVue from './Stories/BadgeWrapperWithIcon.vue';
import BadgeWrapperWithButtonVue from './Stories/BadgeWrapperWithButton.vue';

const { meta, ...stories } = setup({
    component: BadgeWrapper,
    overrides: {
        WithIcon: {
            render: withRender({ BadgeWrapperWithIconVue }),
        },
        WithButton: {
            render: withRender({ BadgeWrapperWithButtonVue }),
        },
    },
});

export default {
    title: 'LumX components/badge/BadgeWrapper',
    ...meta,
};

export const WithIcon = { ...stories.WithIcon };
export const WithButton = { ...stories.WithButton };
