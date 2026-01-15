import { mdiPencil } from '@lumx/icons';
import { Icon, Link } from '@lumx/react';

export default () => (
    <>
        <Link href="#">Default link</Link>
        <Link href="#">
            <Icon icon={mdiPencil} /> Link with an icon
        </Link>
    </>
);
