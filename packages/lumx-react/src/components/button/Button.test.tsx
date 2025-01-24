import React from 'react';

import { mdiCheck, mdiPlus } from '@lumx/icons';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, within } from '@testing-library/react';
import { getByClassName, queryAllByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { Emphasis, Icon } from '@lumx/react';

import { Button, ButtonProps } from './Button';

const CLASSNAME = Button.className as string;

type SetupProps = Partial<ButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<Button {...props} />, { wrapper });
    const button = getByClassName(document.body, CLASSNAME);
    const buttonWrapper = queryByClassName(document.body, 'lumx-button-wrapper');
    const icons = queryAllByClassName(button, Icon.className as string);
    return { props, button, buttonWrapper, icons };
};

describe(`<${Button.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const label = 'Label';
            const { button, icons } = setup({ children: label });
            expect(button).toBe(screen.queryByRole('button', { name: label }));
            expect(button).toHaveAttribute('type', 'button');
            expect(button.className).toMatchInlineSnapshot(
                '"lumx-button lumx-button--color-primary lumx-button--emphasis-high lumx-button--size-m lumx-button--theme-light lumx-button--variant-button"',
            );
            expect(icons.length).toBe(0);
        });

        it('should render icons', () => {
            const label = 'Label';
            const { button, icons } = setup({ children: label, rightIcon: mdiPlus, leftIcon: mdiCheck });
            expect(button).toHaveTextContent(label);
            expect(icons.length).toBe(2);
        });

        it('should render link', () => {
            const label = 'Label';
            const { button } = setup({ children: label, href: 'https://example.com' });
            expect(button).toBe(screen.queryByRole('link', { name: label }));
        });

        it('should render emphasis low', () => {
            const { button } = setup({ emphasis: Emphasis.low });
            expect(button.className).toMatchInlineSnapshot(
                '"lumx-button lumx-button--color-dark lumx-button--emphasis-low lumx-button--size-m lumx-button--variant-button"',
            );
        });

        it('should render hasBackground', () => {
            const label = 'Label';
            const { buttonWrapper, button } = setup({ children: label, hasBackground: true });
            expect(buttonWrapper).toBeInTheDocument();
            expect(button).toBe(within(buttonWrapper as any).queryByRole('button', { name: label }));
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'button',
        forwardAttributes: 'button',
        forwardRef: 'button',
        applyTheme: {
            affects: [{ element: 'button' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
