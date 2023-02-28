import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import {render} from '@testing-library/react';
import { getByClassName} from '@lumx/react/testing/utils/queries';
import { NavigationLink, NavigationLinkProps } from './NavigationLink';

const CLASSNAME = NavigationLink.className as string;

type SetupProps = Partial<NavigationLinkProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (propsOverride: SetupProps = {}) => {
    const props = { ...propsOverride };
    const { container } = render(
            <NavigationLink label="A link" {...props} />,
    );

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        props,
    };
};

describe(`<${NavigationLink.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'element' });
});
