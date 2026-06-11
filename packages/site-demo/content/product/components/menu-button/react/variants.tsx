import { MenuButton, MenuItem, MenuDivider } from '@lumx/react';

export default () => (
    <>
        <MenuButton label="Actions" emphasis="medium" size="s">
            <MenuItem onClick={() => alert('Edit')}>Edit</MenuItem>
            <MenuItem onClick={() => alert('Duplicate')}>Duplicate</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => alert('Delete')}>Delete</MenuItem>
        </MenuButton>

        <MenuButton variant="icon-button" emphasis="low" label="Actions">
            <MenuItem onClick={() => alert('Edit')}>Edit</MenuItem>
            <MenuItem onClick={() => alert('Duplicate')}>Duplicate</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => alert('Delete')}>Delete</MenuItem>
        </MenuButton>

        <MenuButton variant="chip" label="Actions">
            <MenuItem onClick={() => alert('Edit')}>Edit</MenuItem>
            <MenuItem onClick={() => alert('Duplicate')}>Duplicate</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => alert('Delete')}>Delete</MenuItem>
        </MenuButton>

        <MenuButton variant="link" label="Actions">
            <MenuItem onClick={() => alert('Edit')}>Edit</MenuItem>
            <MenuItem onClick={() => alert('Duplicate')}>Duplicate</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => alert('Delete')}>Delete</MenuItem>
        </MenuButton>
    </>
);
