import { classNames } from '@lumx/core/js/utils';
import { List, ListItem, ListSection, Text } from '@lumx/react';

export default () => (
    <>
        <List>
            <ListSection label="Default">
                <ListItem size="big" className={classNames.background('dark-L6')}>
                    <Text as="p">Two-line item</Text>
                    <Text as="p" color="dark-L2">
                        Secondary text
                    </Text>
                </ListItem>
            </ListSection>
        </List>

        <List itemPadding="big">
            <ListSection label="Big padding">
                <ListItem size="big" className={classNames.background('dark-L6')}>
                    <Text as="p">Two-line item</Text>
                    <Text as="p" color="dark-L2">
                        Secondary text
                    </Text>
                </ListItem>
            </ListSection>
        </List>

        <List itemPadding="huge">
            <ListSection label="Huge padding">
                <ListItem size="big" className={classNames.background('dark-L6')}>
                    <Text as="p">Two-line item</Text>
                    <Text as="p" color="dark-L2">
                        Secondary text
                    </Text>
                </ListItem>
            </ListSection>
        </List>
    </>
);
