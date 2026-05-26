import { userEvent } from 'storybook/test';
import { mdiAccount, mdiCog, mdiHelpCircle, mdiLogout } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

export function setup({
    components: { MenuButton, MenuItem, MenuDivider },
}: SetupStoriesOptions<{
    components: {
        MenuButton: any;
        MenuItem: any;
        MenuDivider: any;
    };
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

    const Default = {
        argTypes: {
            onProfile: { action: true },
            onSettings: { action: true },
            onHelp: { action: true },
            onLogout: { action: true },
        },
        args: {
            emphasis: 'high',
        },
        render: ({ onProfile, onSettings, onHelp, onLogout, ...args }: any) => (
            <MenuButton {...args}>
                <MenuItem icon={mdiAccount} onClick={onProfile}>
                    Profile
                </MenuItem>
                <MenuItem icon={mdiCog} onClick={onSettings}>
                    Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={mdiHelpCircle} onClick={onHelp}>
                    Help
                </MenuItem>
                <MenuItem icon={mdiLogout} onClick={onLogout}>
                    Logout
                </MenuItem>
            </MenuButton>
        ),
    };

    return {
        meta,
        Default,
    };
}
