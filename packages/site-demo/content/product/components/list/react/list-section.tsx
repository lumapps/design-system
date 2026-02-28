import { mdiFolderOutline, mdiStarOutline } from '@lumx/icons';
import { List, ListItem, ListSection } from '@lumx/react';

export default () => (
    <List itemPadding="big">
        <ListSection label="Folders" icon={mdiFolderOutline}>
            <ListItem size="tiny">Documents</ListItem>
            <ListItem size="tiny">Pictures</ListItem>
        </ListSection>
        <ListSection label="Favorites" icon={mdiStarOutline}>
            <ListItem size="tiny">Recent</ListItem>
            <ListItem size="tiny">Shared with me</ListItem>
        </ListSection>
    </List>
);
