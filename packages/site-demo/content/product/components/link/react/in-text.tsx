import { Link, Text } from '@lumx/react';

export default () => (
    <Text as="p">
        Links inside a paragraph are <Link href="#">underlined by default</Link> so they remain distinguishable from
        the surrounding text.
    </Text>
);
