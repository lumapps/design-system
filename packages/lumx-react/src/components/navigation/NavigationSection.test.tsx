import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { NavigationButton } from './NavigationButton';
import { NavigationSection, NavigationSectionProps } from './NavigationSection';

const CLASSNAME = NavigationSection.className as string;

type SetupProps = Partial<NavigationSectionProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (propsOverride: SetupProps = {}) => {
    const props = { ...propsOverride };
    const { container } = render(
        <NavigationSection label="Section 1" {...props}>
            <NavigationButton label="A content" />
            <NavigationButton label="A link" />
            <NavigationButton label="A community" />
        </NavigationSection>,
    );

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        query: {
            button: () => screen.getByRole('button', {
                name: /section 1/i
              }),
            content: () => queryByClassName(container, `${CLASSNAME}__drawer`),
        },
        props,
    };
};

describe(`<${NavigationSection.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });

    it('should be closed by default', () => {
        const { element, query } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
        // Section is visible
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        // Content is not visible
        expect(query.content()).not.toBeInTheDocument();
    });

    it('should toggle on click', async () => {
        const { element, query } = setup();

        // Content is not visible
        expect(query.content()).not.toBeInTheDocument();

        // click to open
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'true');
        expect(query.button()).toHaveAttribute('aria-controls');
        expect(query.content()).toBeInTheDocument();
        // aria-controls === query.content().id 
        // Is this ok ?
        expect(query.button().getAttribute('aria-controls')).toBe(query.content()?.getAttribute('id'));
        // click to close
        await userEvent.click(query.button() as any);
        expect(query.button()).toBeInTheDocument();
        expect(query.button()).toHaveAttribute('aria-expanded', 'false');
        expect(query.content()).not.toBeInTheDocument();
    });

    // should have the right aria control id

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'element' });
});
