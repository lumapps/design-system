import { Icon, InlineList, Link, Text } from '@lumx/react';
import { mdiEarth } from '@lumx/icons';

export default () => (
    <InlineList typography="body1" color="dark-L2">
        <Text as="span">Some text</Text>
        <Link href="#">Some link</Link>
        <Icon icon={mdiEarth} />
    </InlineList>
);
