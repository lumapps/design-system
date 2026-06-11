import { userEvent } from 'storybook/test';
import { mdiAccount, mdiCog, mdiHelpCircle, mdiLogout, mdiPencil, mdiTrashCan } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

export function setup({
    components: { MenuButton, MenuItem, MenuDivider },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    components: {
        MenuButton: any;
        MenuItem: any;
        MenuDivider: any;
    };
    decorators: 'withCombinations';
}>) {
    const meta = {
        component: MenuButton,
        argTypes: {
            onOpen: { action: true },
        },
        args: {
            label: 'Open menu',
        },
        async play() {
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
        },
    };

    /** Default menu button config */
    const Default = {
        argTypes: {
            onItemClick: { action: true },
        },
        render: ({ onItemClick, ...args }: any) => (
            <MenuButton {...args}>
                <MenuItem icon={mdiAccount} onClick={onItemClick}>
                    Profile
                </MenuItem>
                <MenuItem icon={mdiCog} onClick={onItemClick}>
                    Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={mdiHelpCircle} onClick={onItemClick}>
                    Help
                </MenuItem>
                <MenuItem icon={mdiLogout} onClick={onItemClick}>
                    Logout
                </MenuItem>
            </MenuButton>
        ),
    };

    /** All MenuButton variants */
    const Variants = {
        argTypes: {
            onItemClick: { action: true },
        },
        decorators: [
            withCombinations({
                combinations: {
                    cols: {
                        Button: {},
                        'Icon button': { variant: 'icon-button', label: 'More actions', emphasis: 'low' },
                        Chip: { variant: 'chip', label: 'Filter by' },
                        Link: { variant: 'link', label: 'Open as link' },
                    },
                },
            }),
        ],
        render: ({ onItemClick, ...args }: any) => (
            <MenuButton {...args}>
                <MenuItem icon={mdiPencil} onClick={onItemClick}>
                    Edit
                </MenuItem>
                <MenuItem onClick={onItemClick}>Duplicate</MenuItem>
                <MenuDivider />
                <MenuItem icon={mdiTrashCan} color="red" onClick={onItemClick}>
                    Delete
                </MenuItem>
            </MenuButton>
        ),
    };

    const WithLinkItems = {
        argTypes: {
            onItemClick: { action: true },
        },
        args: {
            label: 'Actions',
            emphasis: 'low',
        },
    };

    return {
        meta,
        Default,
        Variants,
        WithLinkItems,
    };
}
