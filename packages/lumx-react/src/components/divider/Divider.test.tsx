import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { Theme } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import { Divider, DividerProps } from './Divider';

const CLASSNAME = Divider.className as string;

type SetupProps = Partial<DividerProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: DividerProps = { ...propsOverride };

    render(<Divider {...props} />);
    const divider = screen.queryByRole('separator');

    return { props, divider };
};

describe(`<${Divider.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { divider } = setup();
            expect(divider).toBeInTheDocument();
            expect(divider).toHaveClass(CLASSNAME);
            expect(divider).toHaveClass(`${CLASSNAME}--theme-light`);
        });

        it('should render dark Theme', () => {
            const { divider } = setup({ theme: Theme.dark });
            expect(divider).toHaveClass(`${CLASSNAME}--theme-dark`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'divider',
        forwardAttributes: 'divider',
        forwardRef: 'divider',
    });
});
