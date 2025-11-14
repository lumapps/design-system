import React from 'react';

import { DisabledStateProvider } from '@lumx/react/utils';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { fireEvent, render, screen } from '@testing-library/react';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

const CLASSNAME = Thumbnail.className as string;

const setup = (props: Partial<ThumbnailProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<Thumbnail {...(props as any)} />, { wrapper });
    const thumbnail = queryByClassName(document.body, CLASSNAME);
    return { props, thumbnail, container };
};

describe(`<${Thumbnail.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thumbnail',
        forwardAttributes: 'thumbnail',
        applyTheme: {
            affects: [{ element: 'thumbnail' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });

    describe('clickable button', () => {
        it('should render clickable button', async () => {
            const onClick = vi.fn();
            const { thumbnail } = setup({ onClick, alt: 'Name' });
            const button = screen.getByRole('button', { name: 'Name' });
            expect(button).toBe(thumbnail);
            expect(button).toHaveAttribute('type', 'button');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).toHaveBeenCalled();
        });

        it('should not render button in disabled context', () => {
            const onClick = vi.fn();
            const { thumbnail, container } = setup(
                { onClick, 'aria-label': 'thumbnail' },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );

            // Should render a div instead of a button.
            expect(container.querySelector('button')).toBe(null);
            expect(thumbnail?.tagName).toBe('DIV');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('clickable link', () => {
        it('should render clickable link', async () => {
            const onClick = vi.fn((evt: any) => evt.preventDefault());
            const { thumbnail } = setup({ linkProps: { href: '#' }, onClick, alt: 'Name' });
            const link = screen.getByRole('link');
            expect(link).toBe(thumbnail);
            expect(link).toHaveAttribute('href', '#');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).toHaveBeenCalled();
        });

        it('should not render link in disabled context', () => {
            const { container, thumbnail } = setup(
                { linkAs: 'a', linkProps: { href: '#' }, 'aria-label': 'thumbnail' },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );

            // Should render a div instead of a link.
            expect(container.querySelector('a')).toBe(null);
            expect(thumbnail?.tagName).toBe('DIV');
        });
    });
});
