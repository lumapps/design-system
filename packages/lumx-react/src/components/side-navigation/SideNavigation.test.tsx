import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { Theme } from '@lumx/react';

import { SideNavigation, SideNavigationProps } from './SideNavigation';

const CLASSNAME = SideNavigation.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<SideNavigationProps> = {}) => {
    render(<SideNavigation {...(props as any)} />);
    const sideNavigation = getByClassName(document.body, CLASSNAME);
    return { props, sideNavigation };
};

describe(`<${SideNavigation.displayName}>`, () => {
    it('should render default', () => {
        const { sideNavigation } = setup();
        expect(sideNavigation.className).toMatchInlineSnapshot('"lumx-side-navigation"');
    });

    it('should render dark theme', () => {
        const { sideNavigation } = setup({ theme: Theme.dark });
        expect(sideNavigation.className).toMatchInlineSnapshot('"lumx-color-font-light-N lumx-side-navigation"');
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'sideNavigation',
        forwardAttributes: 'sideNavigation',
        forwardRef: 'sideNavigation',
    });
});
