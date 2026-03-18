import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';

import { useRovingTabIndexContainer, UseRovingTabIndexContainerOptions } from './useRovingTabIndexContainer';

const TestContainer = ({
    itemCount = 3,
    activeIndex = 0,
    disabledIndices = [] as number[],
    ...options
}: Partial<UseRovingTabIndexContainerOptions> & {
    itemCount?: number;
    activeIndex?: number;
    disabledIndices?: number[];
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useRovingTabIndexContainer({
        containerRef: containerRef as React.RefObject<HTMLElement>,
        itemSelector: '.item',
        ...options,
    });

    return (
        <div ref={containerRef}>
            {Array.from({ length: itemCount }, (_, i) => (
                <button
                    key={i}
                    type="button"
                    className="item"
                    tabIndex={i === activeIndex ? 0 : -1}
                    disabled={disabledIndices.includes(i) || undefined}
                >
                    Item {i}
                </button>
            ))}
        </div>
    );
};

describe('useRovingTabIndexContainer', () => {
    describe('keyboard navigation (horizontal)', () => {
        it('should move focus with ArrowRight', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowRight]');

            expect(items[1]).toHaveFocus();
            expect(items[0]).toHaveAttribute('tabindex', '-1');
            expect(items[1]).toHaveAttribute('tabindex', '0');
        });

        it('should move focus with ArrowLeft', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer activeIndex={2} />);
            const items = screen.getAllByRole('button');

            items[2].focus();
            await user.keyboard('[ArrowLeft]');

            expect(items[1]).toHaveFocus();
        });

        it('should ignore ArrowUp/ArrowDown in horizontal mode', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowDown]');

            expect(items[0]).toHaveFocus();
        });

        it('should wrap from last to first', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer activeIndex={2} />);
            const items = screen.getAllByRole('button');

            items[2].focus();
            await user.keyboard('[ArrowRight]');

            expect(items[0]).toHaveFocus();
        });

        it('should wrap from first to last', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowLeft]');

            expect(items[2]).toHaveFocus();
        });
    });

    describe('keyboard navigation (vertical)', () => {
        it('should navigate with ArrowDown/ArrowUp', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer direction="vertical" />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowDown]');
            expect(items[1]).toHaveFocus();

            await user.keyboard('[ArrowUp]');
            expect(items[0]).toHaveFocus();
        });

        it('should ignore ArrowLeft/ArrowRight in vertical mode', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer direction="vertical" />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowRight]');

            expect(items[0]).toHaveFocus();
        });
    });

    describe('Home / End keys', () => {
        it('Home should navigate to the first item', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer itemCount={5} activeIndex={3} />);
            const items = screen.getAllByRole('button');

            items[3].focus();
            await user.keyboard('[Home]');

            expect(items[0]).toHaveFocus();
        });

        it('End should navigate to the last item', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer itemCount={5} />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[End]');

            expect(items[4]).toHaveFocus();
        });
    });

    describe('disabled item skipping', () => {
        it('should skip disabled items when navigating', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer itemCount={4} disabledIndices={[1, 2]} itemDisabledSelector=":disabled" />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowRight]');

            expect(items[3]).toHaveFocus();
        });

        it('Home/End should skip disabled items', async () => {
            const user = userEvent.setup({ delay: null });
            render(
                <TestContainer
                    itemCount={5}
                    activeIndex={2}
                    disabledIndices={[0, 4]}
                    itemDisabledSelector=":disabled"
                />,
            );
            const items = screen.getAllByRole('button');

            items[2].focus();
            await user.keyboard('[Home]');
            expect(items[1]).toHaveFocus();

            await user.keyboard('[End]');
            expect(items[3]).toHaveFocus();
        });
    });

    describe('onItemFocused callback', () => {
        it('should call onItemFocused when an item receives focus via keyboard', async () => {
            const user = userEvent.setup({ delay: null });
            const onItemFocused = vi.fn();
            render(<TestContainer onItemFocused={onItemFocused} />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowRight]');

            expect(onItemFocused).toHaveBeenCalledWith(items[1]);
        });
    });

    describe('stale active item recovery', () => {
        it('should recover navigation when the active item is removed from the DOM', async () => {
            const user = userEvent.setup({ delay: null });
            render(<TestContainer />);
            const items = screen.getAllByRole('button');

            items[0].focus();
            await user.keyboard('[ArrowRight]');
            expect(items[1]).toHaveFocus();

            // Remove item 1 (the currently active item) from the DOM.
            items[1].remove();

            // Focus item 2 and try to navigate — should recover from item 2.
            items[2].focus();
            await user.keyboard('[ArrowLeft]');

            // Should navigate to item 0 (the only remaining neighbor).
            expect(items[0]).toHaveFocus();
        });
    });

    describe('cleanup on unmount', () => {
        it('should remove keydown listener on unmount', async () => {
            const user = userEvent.setup({ delay: null });
            const onItemFocused = vi.fn();
            const { unmount } = render(<TestContainer onItemFocused={onItemFocused} />);
            const items = screen.getAllByRole('button');

            // Navigate to verify it works
            items[0].focus();
            await user.keyboard('[ArrowRight]');
            expect(items[1]).toHaveFocus();
            expect(onItemFocused).toHaveBeenCalledTimes(1);

            unmount();
            onItemFocused.mockClear();

            // Re-attach the items to the DOM so we can test that the listener was removed
            const container = document.createElement('div');
            items.forEach((item) => container.appendChild(item));
            document.body.appendChild(container);

            // Keydown should no longer navigate after unmount
            items[1].focus();
            await user.keyboard('[ArrowRight]');
            expect(items[1]).toHaveFocus();
            expect(onItemFocused).not.toHaveBeenCalled();

            container.remove();
        });
    });

    it('should do nothing when containerRef is null', () => {
        const NullRefComponent = () => {
            useRovingTabIndexContainer({
                containerRef: { current: null } as React.RefObject<HTMLElement>,
                itemSelector: '.item',
            });
            return null;
        };
        // Should not throw
        render(<NullRefComponent />);
    });
});
