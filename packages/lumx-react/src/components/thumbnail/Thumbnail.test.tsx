import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import BaseThumbnailTests, { setup as coreSetup } from '@lumx/core/js/components/Thumbnail/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { DisabledStateProvider } from '@lumx/react/utils';
import { mdiImageBroken } from '@lumx/icons';

import { ThumbnailProps as CoreThumbnailProps } from '@lumx/core/js/components/Thumbnail';
import { Thumbnail, ThumbnailProps } from './Thumbnail';

const CLASSNAME = Thumbnail.className as string;

describe(`<${Thumbnail.displayName}>`, () => {
    const renderThumbnail = (props: CoreThumbnailProps, options?: SetupRenderOptions) => {
        return render(<Thumbnail {...(props as any)} />, options);
    };

    // Run core tests
    BaseThumbnailTests({ render: renderThumbnail, screen });

    const setup = (props: Partial<ThumbnailProps> = {}, options: SetupRenderOptions = {}) => {
        const defaultProps = { alt: 'Test', image: 'https://example.com/image.jpg' };
        return coreSetup({ ...defaultProps, ...props }, { ...options, render: renderThumbnail, screen });
    };

    describe('React-specific', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<Thumbnail alt="Test" image="test.jpg" ref={ref} />);
            expect(ref.current).toHaveClass(CLASSNAME);
        });

        it('should forward imgRef to the native img element', () => {
            const imgRef = React.createRef<HTMLImageElement>();
            render(<Thumbnail alt="Test" image="test.jpg" imgRef={imgRef} />);
            expect(imgRef.current).toBeInstanceOf(HTMLImageElement);
        });

        it('should render badge and apply badge class', () => {
            const { thumbnail } = setup({ badge: <span data-testid="badge">Badge</span> });
            const badge = screen.getByTestId('badge');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass(`${CLASSNAME}__badge`);
            expect(thumbnail).toHaveClass(`${CLASSNAME}--has-badge`);
        });

        it('should render custom fallback element', () => {
            const customFallback = <div data-testid="custom-fallback">Custom Error</div>;
            setup({ loadingState: 'hasError', fallback: customFallback });
            expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
        });

        it('should render icon fallback', () => {
            const { thumbnail } = setup({ loadingState: 'hasError', fallback: mdiImageBroken });
            expect(thumbnail).toHaveClass(`${CLASSNAME}--has-icon-error-fallback`);
            const icon = thumbnail.querySelector('svg');
            expect(icon).toBeInTheDocument();
        });

        it('should handle focusPoint prop', () => {
            const { image } = setup({ focusPoint: { x: 0.5, y: 0.75 } });
            // The focus point is applied via focusPointStyle which is tested in useFocusPointStyle.test.ts
            expect(image).toBeInTheDocument();
        });
    });

    describe('Click events', () => {
        it('should render clickable button and trigger onClick', async () => {
            const onClick = vi.fn();
            const { thumbnail } = setup({ onClick, alt: 'Click me' });
            const button = screen.getByRole('button', { name: 'Click me' });
            expect(button).toBe(thumbnail);
            expect(button).toHaveAttribute('type', 'button');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).toHaveBeenCalled();
        });

        it('should not render button in disabled context', () => {
            const onClick = vi.fn();
            const { container } = render(
                <DisabledStateProvider state="disabled">
                    <Thumbnail onClick={onClick} alt="thumbnail" image="test.jpg" />
                </DisabledStateProvider>,
            );

            const thumbnail = queryByClassName(container, CLASSNAME);
            expect(container.querySelector('button')).toBe(null);
            expect(thumbnail?.tagName).toBe('DIV');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render clickable link and trigger onClick', async () => {
            const onClick = vi.fn((evt: any) => evt.preventDefault());
            const { thumbnail } = setup({ linkProps: { href: '#' }, onClick, alt: 'Link' });
            const link = screen.getByRole('link');
            expect(link).toBe(thumbnail);
            expect(link).toHaveAttribute('href', '#');

            fireEvent.click(thumbnail as HTMLElement);
            expect(onClick).toHaveBeenCalled();
        });

        it('should not render link in disabled context', () => {
            const { container } = render(
                <DisabledStateProvider state="disabled">
                    <Thumbnail linkAs="a" linkProps={{ href: '#' }} alt="thumbnail" image="test.jpg" />
                </DisabledStateProvider>,
            );

            const thumbnail = queryByClassName(container, CLASSNAME);
            expect(container.querySelector('a')).toBe(null);
            expect(thumbnail?.tagName).toBe('DIV');
        });
    });

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
});
