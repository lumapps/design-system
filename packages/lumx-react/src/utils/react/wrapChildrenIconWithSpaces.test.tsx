import React, { Fragment } from 'react';

import { Icon } from '@lumx/react';
import { mdiEarth, mdiFoodApple, mdiPencil } from '@lumx/icons';
import { wrapChildrenIconWithSpaces } from './wrapChildrenIconWithSpaces';

describe(wrapChildrenIconWithSpaces, () => {
    it('should ignore null or undefined children', () => {
        expect(wrapChildrenIconWithSpaces(undefined)).toBeUndefined();
        expect(wrapChildrenIconWithSpaces(null)).toBeUndefined();
    });

    it('should wrap icons with spaces', () => {
        expect(
            wrapChildrenIconWithSpaces(
                <>
                    <Icon icon={mdiEarth} />a string
                    <>
                        some more string with
                        <Icon icon={mdiFoodApple} />
                    </>
                    {['array with', <Icon key="custom-key" icon={mdiPencil} />]}
                </>,
            ),
        ).toEqual([
            // prettier-ignore
            <Fragment key=".0">
                {' '}
                <Icon key=".0" icon={mdiEarth} />{' '}a string
                <Fragment key=".2">
                    some more string with{' '}<Icon key=".1" icon={mdiFoodApple} />{' '}
                </Fragment>
                array with{' '}<Icon key=".3:$custom-key" icon={mdiPencil} />{' '}
            </Fragment>,
        ]);
    });
});
