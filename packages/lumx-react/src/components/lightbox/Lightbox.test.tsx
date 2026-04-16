import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { vi } from 'vitest';

import { Heading, HeadingLevelProvider } from '@lumx/react';
import BaseLightboxTests from '@lumx/core/js/components/Lightbox/Tests';
import { Lightbox, LightboxProps } from './Lightbox';

const CLASSNAME = Lightbox.className as string;

const setup = (props: Partial<LightboxProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const parentElement = { current: document.createElement('div') };
    const propsOverride = {
        isOpen: true,
        children: <ThemeSentinel />,
        parentElement,
        ...props,
    } as any;
    const { container } = render(<Lightbox {...propsOverride} />, { wrapper });
    const lightbox = queryByClassName(document.body, CLASSNAME);
    const themeSentinel = screen.queryByTestId(ThemeSentinel.testId);
    return { props: propsOverride, container, lightbox, themeSentinel };
};

describe(`<${Lightbox.displayName}>`, () => {
    // Run core tests
    BaseLightboxTests({
        render: (props: any) => render(<Lightbox {...props} />),
        screen,
    });

    describe('React', () => {
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

        describe('Close Button', () => {
            it('should render close button when props provided', () => {
                const onClose = vi.fn();
                setup({ closeButtonProps: { label: 'Close Lightbox' }, onClose });
                const closeBtn = screen.getByRole('button', { name: 'Close Lightbox' });
                expect(closeBtn).toBeInTheDocument();
                fireEvent.click(closeBtn);
                expect(onClose).toHaveBeenCalled();
            });
        });

        describe('Interactions', () => {
            it('should trigger onClose on click away', () => {
                const onClose = vi.fn();
                setup({ onClose });
                fireEvent.mouseDown(document.body);
                expect(onClose).toHaveBeenCalled();
            });
        });
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
