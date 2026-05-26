import { mdiDotsVertical, mdiFilter, mdiPencil, mdiStar } from '@lumx/icons';
import { Chip, IconButton } from '@lumx/react';

import { setup } from '@lumx/core/js/components/Menu/MenuButtonStories';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { iconArgType } from '@lumx/core/stories/controls/icons';

import { MenuButton, MenuItem, MenuDivider } from '.';

const { meta, ...stories } = setup({
    components: { MenuButton, MenuItem, MenuDivider },
});

export default {
    title: 'LumX components/menu/MenuButton',
    ...meta,
};

export const Default = { ...stories.Default };

/** Menu button as IconButton */
export const AsIconButton = {
    argTypes: {
        onEdit: { action: true },
        onDuplicate: { action: true },
        onDelete: { action: true },
        icon: iconArgType,
    },
    args: {
        label: 'More actions',
        icon: mdiDotsVertical,
        emphasis: 'low',
    },
    render: ({ onEdit, onDuplicate, onDelete, ...args }: any) => (
        <MenuButton {...args} as={IconButton}>
            <MenuItem icon={mdiPencil} onClick={onEdit}>
                Edit
            </MenuItem>
            <MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onDelete}>Delete</MenuItem>
        </MenuButton>
    ),
};

/** Menu button as Chip */
export const AsChip = {
    argTypes: {
        onAll: { action: true },
        onActive: { action: true },
        onArchived: { action: true },
    },
    render: ({ onAll, onActive, onArchived, ...args }: any) => (
        <MenuButton {...args} as={Chip} isClickable>
            <MenuItem icon={mdiFilter} onClick={onAll}>
                All
            </MenuItem>
            <MenuItem icon={mdiStar} onClick={onActive}>
                Active
            </MenuItem>
            <MenuItem onClick={onArchived}>Archived</MenuItem>
        </MenuButton>
    ),
};

/** Menu with item with custom link action */
export const WithCustomLinkAction = {
    args: {
        label: 'Actions',
        emphasis: 'low' as const,
    },
    render: (args: any) => (
        <MenuButton {...args}>
            <MenuItem>Default item</MenuItem>
            <MenuItem actionProps={{ as: CustomLink, to: '/page' }}>Custom link action</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => {}}>Delete</MenuItem>
        </MenuButton>
    ),
};
