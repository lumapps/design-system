import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, IconButton, List, ListItem, ListSubheader, Thumbnail, Text } from '@lumx/react';

export default () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem size="huge">
            <Text as="p">Multi-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter se
                differunt. Idque Caesaris facere voluntate liceret: sese habere
            </Text>
        </ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size="huge" before={<Icon icon={mdiSend} size="xs" />}>
            <Text as="p">Multi-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter se
                differunt. Idque Caesaris facere voluntate liceret: sese habere
            </Text>
        </ListItem>

        <ListItem
            size="huge"
            before={<Thumbnail variant="rounded" alt="Thumbnail" image="/demo-assets/square1.jpg" size="m" />}
            after={<IconButton label="More" emphasis="low" icon={mdiDotsHorizontal} />}
        >
            <Text as="p">Multi-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter se
                differunt. Idque Caesaris facere voluntate liceret: sese habere
            </Text>
        </ListItem>

        <ListItem
            size="huge"
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size="m" />}
            after={<Button emphasis="low">Button</Button>}
        >
            <Text as="p">Multi-line item</Text>
            <Text as="p" color="dark-L2">
                Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter se
                differunt. Idque Caesaris facere voluntate liceret: sese habere
            </Text>
        </ListItem>
    </List>
);
