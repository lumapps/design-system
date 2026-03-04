import { Icon, InlineList, Text } from '@lumx/react';
import { mdiEarth } from '@lumx/icons';

export default () => (
    <InlineList typography="body1" color="dark-L2" wrap style={{ maxWidth: 275 }}>
        <Text as="span">
            <Icon icon={mdiEarth} />
            Some text
        </Text>
        <Text as="span">Very very very very very long text</Text>
    </InlineList>
);
