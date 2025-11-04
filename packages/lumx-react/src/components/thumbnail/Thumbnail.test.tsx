import React from 'react';

import { DisabledStateProvider } from '@lumx/react/utils';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { fireEvent, render } from '@testing-library/react';
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

    describe('disabled state', () => {
        it('should not be clickable when disabled from context', () => {
            const onClick = jest.fn();
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

        it('should have no href when disabled from context', () => {
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
