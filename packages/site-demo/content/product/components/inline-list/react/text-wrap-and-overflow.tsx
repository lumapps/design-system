import { Icon, InlineList, Text } from '@lumx/react';
import { mdiEarth } from '@lumx/icons';

export default () => (
    <InlineList typography="body1" color="dark-L2" style={{ maxWidth: 275 }}>
        <Text as="span" noWrap>
            <Icon icon={mdiEarth} />
            Some text
        </Text>
        <Text as="span" truncate>
            Very very very very very long text
        </Text>
    </InlineList>
);
