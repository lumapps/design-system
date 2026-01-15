import { mdiTypewriter } from '@lumx/icons';
import { Heading, Icon, Link } from '@lumx/react';

export default () => (
    <>
        <Link href="#" typography="title">
            Link with title <Icon icon={mdiTypewriter} /> typography
        </Link>
        <Heading as="h2">
            <Link href="#">
                Link with inherited <Icon icon={mdiTypewriter} /> typography
            </Link>
        </Heading>
    </>
);
