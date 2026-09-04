import { Fragment } from 'react';

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
                <Icon key=".0" icon={mdiEarth} />{' '}a string
                <Fragment key=".2">
                    some more string with{' '}<Icon key=".1" icon={mdiFoodApple} />{' '}
                </Fragment>
                array with{' '}<Icon key=".3:$custom-key" icon={mdiPencil} />
            </Fragment>,
        ]);
    });

    it('should not add a space before an icon starting the text', () => {
        expect(
            wrapChildrenIconWithSpaces(
                <>
                    <Icon icon={mdiEarth} />a string
                </>,
            ),
        ).toEqual([
            // prettier-ignore
            <Fragment key=".0">
                <Icon key=".0" icon={mdiEarth} />{' '}a string
            </Fragment>,
        ]);
    });

    it('should not add a space after an icon ending the text', () => {
        expect(
            wrapChildrenIconWithSpaces(
                <>
                    a string
                    <Icon icon={mdiEarth} />
                </>,
            ),
        ).toEqual([
            // prettier-ignore
            <Fragment key=".0">
                a string{' '}<Icon key=".1" icon={mdiEarth} />
            </Fragment>,
        ]);
    });

    it('should not add any space around an icon alone', () => {
        expect(wrapChildrenIconWithSpaces(<Icon icon={mdiEarth} />)).toEqual([<Icon key=".0" icon={mdiEarth} />]);
    });

    it('should detect the edges of the text through nested elements', () => {
        expect(
            wrapChildrenIconWithSpaces(
                <>
                    <span>
                        <Icon icon={mdiEarth} />
                    </span>
                    a string
                    <span>
                        <Icon icon={mdiFoodApple} />
                    </span>
                </>,
            ),
        ).toEqual([
            // prettier-ignore
            <Fragment key=".0">
                <span key=".0"><Icon key=".0" icon={mdiEarth} />{' '}</span>
                a string
                <span key=".2">{' '}<Icon key=".0" icon={mdiFoodApple} /></span>
            </Fragment>,
        ]);
    });
});
