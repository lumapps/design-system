import { classNames } from '@lumx/core/js/utils';
import { List, ListItem, ListSubheader, Text } from '@lumx/react';

export default () => (
    <div>
        <List>
            <ListSubheader>Default</ListSubheader>

            <ListItem size="big" className={classNames.background('dark-L6')}>
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>
        <List itemPadding="big">
            <ListSubheader>Big padding</ListSubheader>

            <ListItem size="big" className={classNames.background('dark-L6')}>
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>
        <List itemPadding="huge">
            <ListSubheader>Huge padding</ListSubheader>

            <ListItem size="big" className={classNames.background('dark-L6')}>
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2">
                    Secondary text
                </Text>
            </ListItem>
        </List>
    </div>
);
