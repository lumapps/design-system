import React from 'react';

import { commonTestsSuiteRTL, RenderWrapper } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { Orientation } from '@lumx/core/js/constants';

import { NavigationItem } from './NavigationItem';
import { NavigationSection, NavigationSectionProps } from './NavigationSection';
import { NavigationContext } from './context';

const CLASSNAME = NavigationSection.className as string;

type SetupProps = Partial<NavigationSectionProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (
    propsOverride: SetupProps = {},
    { orientation = Orientation.vertical, wrapper }: { orientation?: Orientation; wrapper?: RenderWrapper } = {},
) => {
    const props = { label: 'Section 1', ...propsOverride };
    const { container } = render(
        <NavigationContext.Provider value={{ orientation }}>
            <NavigationSection {...props}>
                <NavigationItem label="A content" href="" />
                <NavigationItem label="A link" href="" />
                <NavigationItem label="A community" href="" />
            </NavigationSection>
        </NavigationContext.Provider>,
        { wrapper },
    );

    const query = {
        button: () => screen.getByRole('button', { name: props.label as string }),
        content: () => queryByClassName(container, `${CLASSNAME}__drawer`),
        popover: () => queryByClassName(container, `${CLASSNAME}__drawer--popover`),
    };
    return {
        container,
        element: getByClassName(container, CLASSNAME),
        button: query.button(),
        query,
        props,
    };
};

describe(`<${NavigationSection.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    it('should be closed by default in vertical mode', () => {
        const { element, query } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        // Section is visible
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        // Content is not visible
        expect(query.content()).not.toBeInTheDocument();
    });

    it('should be closed by default in horizontal mode', () => {
        const { element, query } = setup({}, { orientation: Orientation.horizontal });
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        // Section is visible
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        // Content is not visible
        expect(query.popover()).not.toBeInTheDocument();
    });

    it('should toggle on click in vertical mode', async () => {
        const { query } = setup();
        // Content is not visible
        expect(query.content()).not.toBeInTheDocument();
        // click to open
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'true');
        expect(query.button()).toHaveAttribute('aria-controls');
        expect(query.content()).toBeInTheDocument();
        expect(query.button().getAttribute('aria-controls')).toBe(query.content()?.getAttribute('id'));
        // click to close
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        expect(query.content()).not.toBeInTheDocument();
    });

    it('should be in a popover and toggle on click in horizontal mode', async () => {
        const { query } = setup({}, { orientation: Orientation.horizontal });
        // Content is not visible
        expect(query.popover()).not.toBeInTheDocument();
        // click to open
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'true');
        expect(query.button()).toHaveAttribute('aria-controls');
        expect(query.popover()).toBeInTheDocument();
        expect(query.button().getAttribute('aria-controls')).toBe(query.popover()?.getAttribute('id'));
        // click to close
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        expect(query.popover()).not.toBeInTheDocument();
    });

    it('should also toggle on click away in horizontal mode', async () => {
        const { query } = setup({}, { orientation: Orientation.horizontal });
        // Content is not visible
        expect(query.popover()).not.toBeInTheDocument();
        // click to open
        await userEvent.click(query.button() as any);
        expect(query.popover()).toBeInTheDocument();
        // click away to close
        await userEvent.click(document.body);
        expect(query.popover()).not.toBeInTheDocument();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'button',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: false,
            viaContext: true,
        },
    });
});
