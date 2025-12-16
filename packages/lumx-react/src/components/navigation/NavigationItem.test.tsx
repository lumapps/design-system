import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { NavigationItem, NavigationItemProps } from './NavigationItem';

const CLASSNAME = NavigationItem.className as string;

type SetupProps = Partial<NavigationItemProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (propsOverride: SetupProps = {}) => {
    const props = { ...propsOverride };
    const { container } = render(<NavigationItem label="A link" href="" {...props} />);

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        link: getByClassName(container, `${CLASSNAME}__link`),
        props,
    };
};

describe(`<${NavigationItem.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'link' });
});
