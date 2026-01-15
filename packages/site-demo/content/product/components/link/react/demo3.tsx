import { Link } from '@lumx/react';

export default () => (
    <>
        <Link href="#" color="dark">
            Dark color link
        </Link>
        <div className="lumx-spacing-padding lumx-color-background-dark-N">
            <Link href="#" color="light">
                Light color link
            </Link>
        </div>
    </>
);
