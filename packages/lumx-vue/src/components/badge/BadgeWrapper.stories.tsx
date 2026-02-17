import { setup } from '@lumx/core/js/components/Badge/BadgeWrapperStories';
import { Badge, BadgeWrapper, Button, Icon } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: BadgeWrapper,
    render: ({ children, badge, ...args }: any) => (
        <BadgeWrapper {...args}>{{ default: () => children, badge: () => badge }}</BadgeWrapper>
    ),
    components: { Badge, Icon, Button },
});

export default { title: 'LumX components/badge/BadgeWrapper', ...meta };

export const WithIcon = { ...stories.WithIcon };
export const WithButton = { ...stories.WithButton };
