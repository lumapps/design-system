import { mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, List, ListItem, Text } from '@lumx/react';

export default () => (
    <>
        <List>
            <ListItem>Simple item</ListItem>
            <ListItem>
                <Text as="p">Multi-line item</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>

        <List>
            <ListItem before={<Icon icon={mdiSend} size="xs" hasShape />}>Item with icon before</ListItem>

            <ListItem
                before={<Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="m" />}
                after={
                    <Button emphasis="medium" size="s">
                        Button
                    </Button>
                }
            >
                <Text as="p">Item with before and after</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>
    </>
);
