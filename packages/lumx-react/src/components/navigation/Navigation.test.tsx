import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render} from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { NavigationButton } from './NavigationButton';
import { NavigationLink } from './NavigationLink';
import { Navigation, NavigationProps } from '.';

const CLASSNAME = Navigation.className as string;

type SetupProps = Partial<NavigationProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
*/

const setup = (propsOverride: SetupProps = {}) => {
    const props = { 'aria-label': 'navigation', ...propsOverride } as any;
    const { container } = render(
        <Navigation {...props}>
            <NavigationButton label="A button" />
            <NavigationLink label="A link" />
            <NavigationButton label="A button" />
        </Navigation>,
    );

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        query: {},
        props,
    };
};

describe(`<${Navigation.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'element' });
});
