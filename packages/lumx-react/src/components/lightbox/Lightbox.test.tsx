import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { vi } from 'vitest';

import { Heading, HeadingLevelProvider } from '@lumx/react';
import { DialogHeading } from '@lumx/react/components/dialog';
import BaseLightboxTests from '@lumx/core/js/components/Lightbox/Tests';
import { DialogLabelRegistryTests } from '@lumx/core/js/components/Dialog/labelRegistryTests';
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

    // Core shared tests: DialogHeading registry wiring.
    DialogLabelRegistryTests({
        render: ({ children, ...props }: any) =>
            render(
                <Lightbox isOpen parentElement={{ current: document.createElement('div') }} {...props}>
                    {children}
                </Lightbox>,
            ),
        makeDialogHeading: (name: string) => <DialogHeading>{name}</DialogHeading>,
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

        // Registry link/absent cases are covered by the shared DialogLabelRegistryTests above; mechanics
        // (last-wins, fallback, unmount) by the IdsRegistry tests. Here we only assert Lightbox's own
        // top-level aria props take precedence over the registry.
        describe('Label registry', () => {
            it('should let an explicit aria-label prop override the registry', () => {
                setup({ 'aria-label': 'Explicit label', children: <DialogHeading>My lightbox</DialogHeading> } as any);
                const dialog = screen.getByRole('dialog');
                expect(dialog).toHaveAttribute('aria-label', 'Explicit label');
                expect(dialog).not.toHaveAttribute('aria-labelledby');
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
