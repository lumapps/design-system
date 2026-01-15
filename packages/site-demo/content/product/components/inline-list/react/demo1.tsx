import { Icon, InlineList, Link, Text } from '@lumx/react';
import { mdiEarth } from '@lumx/icons';

export default () => (
    <InlineList>
        <Text as="span">Some text</Text>
        <Link href="#">Some link</Link>
        <Icon icon={mdiEarth} />
    </InlineList>
);
