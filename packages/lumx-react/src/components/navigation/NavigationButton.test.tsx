import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName} from '@lumx/react/testing/utils/queries';
import { NavigationButton, NavigationButtonProps } from './NavigationButton';
import userEvent from '@testing-library/user-event';

const CLASSNAME = NavigationButton.className as string;

type SetupProps = Partial<NavigationButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */

const setup = (propsOverride: SetupProps = {}) => {
    const props = { ...propsOverride };
    const { container } = render(
            <NavigationButton label="button"  {...props}/>
    );
    

    return {
        container,
        element: getByClassName(container, CLASSNAME),
        query: {
            button: () => screen.getByRole('button', {
                name: /button/i
              }),
        },
        props,
    };
};

describe(`<${NavigationButton.displayName}>`, () => {
    it('should render default', () => {
        const { element } = setup();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(CLASSNAME);
    });


    it('should call action on click', async () => {
        const onclick : jest.Mock = jest.fn();
        const { query } = setup({ onClick: onclick});
        await userEvent.click(query.button() as any);
        expect(onclick).toHaveBeenCalled()
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'element', forwardAttributes: 'element' });
});
