import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';

import { Heading, HeadingLevelProvider } from '@lumx/react';
import { Lightbox, LightboxProps } from './Lightbox';

const CLASSNAME = Lightbox.className as string;

const setup = (props: Partial<LightboxProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const propsOverride = {
        isOpen: true,
        children: <ThemeSentinel />,
        ...props,
    } as any;
    const { container } = render(<Lightbox {...propsOverride} />, { wrapper });
    const lightbox = queryByClassName(document.body, CLASSNAME);
    const themeSentinel = screen.queryByTestId(ThemeSentinel.testId);
    return { props, container, lightbox, themeSentinel };
};

describe(`<${Lightbox.displayName}>`, () => {
    it('should have reset the heading level context', () => {
        setup(
            {
                // Heading inside the lightbox
                children: <Heading>Title</Heading>,
            },
            {
                // This level context should not affect headings inside the lightbox
                wrapper({ children }) {
                    return <HeadingLevelProvider level={3}>{children}</HeadingLevelProvider>;
                },
            },
        );
        // Heading inside should use the lightbox heading level 2
        expect(screen.queryByRole('heading', { name: 'Title', level: 2 })).toBeInTheDocument();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'lightbox',
        forwardAttributes: 'lightbox',
        forwardRef: 'lightbox',
        applyTheme: {
            affects: [{ not: { element: 'themeSentinel' } }],
            viaProp: true,
            viaContext: true,
        },
    });
});
