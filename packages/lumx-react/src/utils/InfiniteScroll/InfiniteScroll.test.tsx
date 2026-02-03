/* eslint-disable max-classes-per-file */
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { InfiniteScroll } from './InfiniteScroll';

describe('InfiniteScroll', () => {
    let observeCallback: IntersectionObserverCallback;
    let observeMock: any;
    let unobserveMock: any;
    let disconnectMock: any;

    beforeEach(() => {
        observeMock = vi.fn();
        unobserveMock = vi.fn();
        disconnectMock = vi.fn();

        // Mock IntersectionObserver as a class constructor
        global.IntersectionObserver = class IntersectionObserver {
            constructor(callback: IntersectionObserverCallback) {
                observeCallback = callback;
            }

            observe = observeMock;

            unobserve = unobserveMock;

            disconnect = disconnectMock;
        } as any;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render with correct className and style', () => {
        const callback = vi.fn();
        const { container } = render(<InfiniteScroll callback={callback} />);

        const element = container.querySelector('.lumx-infinite-scroll-anchor');
        expect(element).toBeTruthy();
        expect(element).toHaveStyle({ height: '4px' });
        expect(element).toHaveAttribute('aria-hidden', 'true');
    });

    it('should call callback when element is intersecting', async () => {
        const callback = vi.fn();
        render(<InfiniteScroll callback={callback} />);

        // Simulate intersection
        const entries: Partial<IntersectionObserverEntry>[] = [{ isIntersecting: true } as IntersectionObserverEntry];

        await waitFor(() => {
            observeCallback(entries as IntersectionObserverEntry[], {} as IntersectionObserver);
        });

        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback when element is not intersecting', async () => {
        const callback = vi.fn();
        render(<InfiniteScroll callback={callback} />);

        // Simulate no intersection
        const entries: Partial<IntersectionObserverEntry>[] = [{ isIntersecting: false } as IntersectionObserverEntry];

        await waitFor(() => {
            observeCallback(entries as IntersectionObserverEntry[], {} as IntersectionObserver);
        });

        expect(callback).not.toHaveBeenCalled();
    });

    it('should pass options to IntersectionObserver', () => {
        const callback = vi.fn();
        const options = { threshold: 0.5, rootMargin: '10px' };
        const constructorSpy = vi.fn();

        global.IntersectionObserver = class IntersectionObserver {
            constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
                constructorSpy(cb, opts);
                observeCallback = cb;
            }

            observe = observeMock;

            unobserve = unobserveMock;

            disconnect = disconnectMock;
        } as any;

        render(<InfiniteScroll callback={callback} options={options} />);

        expect(constructorSpy).toHaveBeenCalledWith(expect.any(Function), options);
    });

    it('should unobserve element on unmount', () => {
        const callback = vi.fn();
        const { unmount } = render(<InfiniteScroll callback={callback} />);

        unmount();

        expect(unobserveMock).toHaveBeenCalled();
    });
});
