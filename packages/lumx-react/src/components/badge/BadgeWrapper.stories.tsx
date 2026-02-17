import { mdiHeart } from '@lumx/icons';
import { Badge, BadgeWrapper, Button, Chip, ColorPalette, Icon } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Badge/BadgeWrapperStories';

const { meta, ...stories } = setup({
    component: BadgeWrapper,
    components: { Badge, Icon, Button },
});

export default { title: 'LumX components/badge/BadgeWrapper', ...meta };

export const WithIcon = { ...stories.WithIcon };
export const WithButton = { ...stories.WithButton };

/** React-only: Using badge wrapper with chip (Chip not available in Vue) */
export const WithChip = {
    args: {
        badge: (
            <Badge color={ColorPalette.red}>
                <Icon icon={mdiHeart} />
            </Badge>
        ),
        children: <Chip>Some chip</Chip>,
    },
};
