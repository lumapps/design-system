import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getAllByClassName, getByClassName } from '@lumx/react/testing/utils/queries';
import { Orientation } from '@lumx/core/js/constants';
import { Navigation, NavigationProps } from '.';

const CLASSNAME = Navigation.className as string;

type SetupProps = Partial<NavigationProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props = { 'aria-label': 'navigation', ...propsOverride } as any;
    const { container } = render(
        <Navigation {...props}>
            <Navigation.Item label="A link" href="" />
            <Navigation.Item label="A link" as="button" />
            <Navigation.Item label="A link" href="" />
        </Navigation>,
        { wrapper },
    );

    const element = getByClassName(container, CLASSNAME);
    const items = getAllByClassName(element, Navigation.Item.className as string);
    return { container, element, items, props };
};

describe(`<${Navigation.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    it('should render vertically by default', () => {
        const { element } = setup();
        expect(element).toHaveClass(`${CLASSNAME}--orientation-vertical`);
    });

    it('should render vertically when orientation is set to vertical', () => {
        const { element } = setup({ orientation: Orientation.vertical });
        expect(element).toHaveClass(`${CLASSNAME}--orientation-vertical`);
    });

    it('should render horizontally when orientation is set to horizontal', () => {
        const { element } = setup({ orientation: Orientation.horizontal });
        expect(element).toHaveClass(`${CLASSNAME}--orientation-horizontal`);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }, { element: 'items' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
