import React from 'react';

import { ColorPalette, ColorVariant, Icon, Typography } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName, queryAllByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mdiCheck, mdiPlus } from '@lumx/icons';
import { Link, LinkProps } from './Link';

const CLASSNAME = Link.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: LinkProps = {}) => {
    render(<Link {...props} />);
    const link = getByClassName(document.body, CLASSNAME);
    const rightIcon = queryByClassName(link, `${CLASSNAME}__right-icon`);
    const leftIcon = queryByClassName(link, `${CLASSNAME}__left-icon`);
    return { props, link, rightIcon, leftIcon };
};

describe(`<${Link.displayName}>`, () => {
    describe('Props', () => {
        it('should render link', () => {
            const name = 'Link';
            const { props, link, rightIcon, leftIcon } = setup({ href: 'https://example.com', children: name });

            expect(link).toBe(screen.queryByRole('link', { name }));
            expect(link).toHaveAttribute('href', props.href);
            expect(link.className).toMatchInlineSnapshot('"lumx-link"');

            expect(rightIcon).not.toBeInTheDocument();
            expect(leftIcon).not.toBeInTheDocument();
        });

        it('should render color & color variant', () => {
            const { link } = setup({
                href: 'https://google.com',
                color: ColorPalette.primary,
                colorVariant: ColorVariant.D1,
            });
            expect(link.className).toBe('lumx-link lumx-link--color-primary lumx-link--color-variant-D1');
        });

        it('should render typography', () => {
            const { link } = setup({ href: 'https://google.com', typography: Typography.title });
            expect(link.className).toBe('lumx-link lumx-link--has-typography lumx-typography-title');
        });

        it('should render a button', () => {
            const name = 'Link';
            const onClick = vi.fn();
            const { link } = setup({ onClick, children: name });
            expect(link).toBe(screen.queryByRole('button', { name }));
        });

        it('should render with icons', () => {
            const { link } = setup({
                leftIcon: mdiCheck,
                children: ['Link', <Icon key="icon" icon={mdiCheck} />, 'with icons'],
                rightIcon: mdiPlus,
            });
            const icons = queryAllByClassName(link, Icon.className as string);
            expect(icons).toHaveLength(3);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });
    });

    describe('Disabled state', () => {
        it('should render disabled button', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, onClick });
            expect(link).toHaveAttribute('disabled');
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled link', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, href: 'https://example.com', onClick });
            // Disabled link do not exist so we fallback to a button
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(link).toHaveAttribute('disabled');
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render aria-disabled button', async () => {
            const onClick = vi.fn();
            const { link } = setup({ children: 'Label', 'aria-disabled': true, onClick });
            expect(link).toHaveAttribute('aria-disabled');
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render aria-disabled link', async () => {
            const onClick = vi.fn();
            const { link } = setup({
                children: 'Label',
                'aria-disabled': true,
                href: 'https://example.com',
                onClick,
            });
            expect(link).toHaveAccessibleName('Label');
            // Disabled link do not exist so we fallback to a button
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(link).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'link',
        forwardClassName: 'link',
        forwardRef: 'link',
    });
});
