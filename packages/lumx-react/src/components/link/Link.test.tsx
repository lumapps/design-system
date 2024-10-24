import React from 'react';

import { ColorPalette, ColorVariant, Typography } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { mdiCheck, mdiPlus } from '@lumx/icons';
import { Link, LinkProps } from './Link';

const CLASSNAME = Link.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: LinkProps = {}) => {
    render(<Link {...props} />);
    const link = getByClassName(document.body, CLASSNAME);
    const content = queryByClassName(link, `${CLASSNAME}__content`);
    const rightIcon = queryByClassName(link, `${CLASSNAME}__right-icon`);
    const leftIcon = queryByClassName(link, `${CLASSNAME}__left-icon`);

    return { props, link, content, rightIcon, leftIcon };
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
            expect(link.className).toMatchInlineSnapshot(
                '"lumx-link lumx-link--color-primary lumx-link--color-variant-D1"',
            );
        });

        it('should render typography', () => {
            const { content } = setup({ href: 'https://google.com', typography: Typography.title });
            expect(content?.className).toMatchInlineSnapshot('undefined');
        });

        it('should render a button', () => {
            const name = 'Link';
            const onClick = jest.fn();
            const { link } = setup({ onClick, children: name });
            expect(link).toBe(screen.queryByRole('button', { name }));
        });

        it('should render with icons', () => {
            const { rightIcon, leftIcon } = setup({ rightIcon: mdiPlus, leftIcon: mdiCheck });
            expect(rightIcon).toBeInTheDocument();
            expect(leftIcon).toBeInTheDocument();
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
