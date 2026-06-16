import { MenuButton, MenuItem, MenuDivider } from '@lumx/react';
import { mdiDelete, mdiFileDocumentOutline, mdiOpenInNew, mdiPencil } from '@lumx/icons';

export default () => (
    <MenuButton label="Item options">
        <MenuItem icon={mdiPencil} onClick={() => alert('Edit')}>
            Edit
        </MenuItem>
        <MenuItem icon={mdiDelete} color="red" onClick={() => alert('Delete')}>
            Delete
        </MenuItem>
        <MenuDivider />
        <MenuItem
            icon={mdiFileDocumentOutline}
            afterIcon={mdiOpenInNew}
            actionProps={{ as: 'a', href: 'https://example.com/docs', target: '_blank' }}
        >
            Documentation
        </MenuItem>
    </MenuButton>
);
