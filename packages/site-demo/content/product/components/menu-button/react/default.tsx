import { MenuButton, MenuItem, MenuDivider } from '@lumx/react';
import { mdiAccount, mdiCog, mdiLogout } from '@lumx/icons';

export default () => (
    <MenuButton label="Menu button">
        <MenuItem icon={mdiAccount} onClick={() => alert('Profile')}>
            Profile
        </MenuItem>
        <MenuItem icon={mdiCog} onClick={() => alert('Settings')}>
            Settings
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={mdiLogout} onClick={() => alert('Logout')}>
            Logout
        </MenuItem>
    </MenuButton>
);
