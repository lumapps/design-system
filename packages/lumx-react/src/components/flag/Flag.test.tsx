import React from 'react';

import { ColorPalette, Theme } from '@lumx/react';
import { mdiAbTesting } from '@lumx/icons';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { Flag, FlagProps } from './Flag';

const CLASSNAME = Flag.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<FlagProps> = {}) => {
    const props = { label: 'default', ...propOverrides };

    render(<Flag {...props} />);
    const flag = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(flag, `${CLASSNAME}__icon`);

    return { props, flag, icon };
};

describe(`<${Flag.displayName} />`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { flag, icon } = setup();
            expect(flag).toBeInTheDocument();
            expect(flag).toHaveClass(CLASSNAME);
            expect(flag).toHaveClass(`${CLASSNAME}--color-dark`);
            expect(icon).not.toBeInTheDocument();
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: mdiAbTesting });
            expect(icon).toBeInTheDocument();
        });

        it('should render dark theme', () => {
            const { flag } = setup({ theme: Theme.dark });
            expect(flag).toHaveClass(`${CLASSNAME}--color-light`);
        });

        it('should render custom color', () => {
            const { flag } = setup({ color: ColorPalette.red });
            expect(flag).toHaveClass(`${CLASSNAME}--color-red`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'flag', forwardAttributes: 'flag' });
});
