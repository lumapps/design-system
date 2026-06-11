import { mdiOpenInNew } from '@lumx/icons';

import { setup } from '@lumx/core/js/components/Menu/MenuButtonStories';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

import { MenuButton, MenuItem, MenuDivider } from '.';

const { meta, ...stories } = setup({
    components: { MenuButton, MenuItem, MenuDivider },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/menu/MenuButton',
    ...meta,
};

/** Default menu button config */
export const Default = { ...stories.Default };

/** All MenuButton variants */
export const Variants = { ...stories.Variants };

/** Menu with link items */
export const WithLinkItems = {
    ...stories.WithLinkItems,
    render: ({ onItemClick, ...args }: any) => (
        <MenuButton {...args}>
            <MenuItem onClick={onItemClick} actionProps={{ as: 'a', href: '#' }}>
                HTML link
            </MenuItem>

            <MenuItem
                onClick={onItemClick}
                actionProps={{ as: CustomLink, to: 'https://example.com', target: '_blank' }}
                afterIcon={mdiOpenInNew}
            >
                Custom link target=_blank
            </MenuItem>
        </MenuButton>
    ),
};
