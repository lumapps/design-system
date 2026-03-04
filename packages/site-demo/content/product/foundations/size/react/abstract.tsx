import { LinkPreview, List, ListItem, Text } from '@lumx/react';

export default () => (
    <>
        <List>
            <ListItem size="big">
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>

        <LinkPreview
            link="https://google.com"
            title="Link title"
            size="big"
            thumbnail="https://picsum.photos/320/240"
            style={{ width: 350 }}
        />
    </>
);
