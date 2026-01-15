import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, IconButton, List, ListItem, ListSubheader, Thumbnail, Text } from '@lumx/react';

export default () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem size="big">
            <Text as="p">Two-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text
            </Text>
        </ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size="big" before={<Icon icon={mdiSend} size="xs" />}>
            <Text as="p">Two-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text
            </Text>
        </ListItem>

        <ListItem
            size="big"
            before={<Thumbnail variant="rounded" alt="Thumbnail" image="/demo-assets/square1.jpg" size="m" />}
            after={<IconButton label="More" emphasis="low" icon={mdiDotsHorizontal} />}
        >
            <Text as="p">Two-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text
            </Text>
        </ListItem>

        <ListItem
            size="big"
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size="m" />}
            after={<Button emphasis="low">Button</Button>}
        >
            <Text as="p">Two-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text
            </Text>
        </ListItem>
    </List>
);
