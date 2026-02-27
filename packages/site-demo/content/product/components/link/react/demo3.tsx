import { classNames } from '@lumx/core/js/utils';
import { Link } from '@lumx/react';

export default () => (
    <>
        <Link href="#" color="dark">
            Dark color link
        </Link>
        <div className={classNames.join(classNames.padding(), 'lumx-color-background-dark-N')}>
            <Link href="#" color="light">
                Light color link
            </Link>
        </div>
    </>
);
