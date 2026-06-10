/* eslint-disable no-await-in-loop */
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/dom';

// ─── Types ───────────────────────────────────────────────────────

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the MenuButton test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface MenuButtonTestSetup {
    components: {
        MenuButton: any;
        MenuItem: any;
    };
    /**
     * Render a MenuButton template.
     *
     * @param template JSX render function returning the element to render.
     */
    render: (template: () => any) => RenderResult;
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function menuButtonTests({ components, render }: MenuButtonTestSetup) {
    const { MenuButton, MenuItem } = components;

    /** Default MenuButton template with two items. */
    const defaultTemplate = () => (
        <MenuButton label="Open menu">
            <MenuItem onClick={() => undefined}>First</MenuItem>
            <MenuItem>Second</MenuItem>
        </MenuButton>
    );

    const setup = () => {
        const result = render(defaultTemplate);
        return { ...result, trigger: screen.getByRole('button', { name: 'Open menu' }) };
    };

    // ─── Render ──────────────────────────────────────────────────

    describe('render', () => {
        it('renders trigger with correct text content', () => {
            const { trigger } = setup();
            expect(trigger).toBeInTheDocument();
            expect(trigger).toHaveTextContent('Open menu');
        });

        it('sets ARIA attributes on the trigger', () => {
            const { trigger } = setup();
            expect(trigger).toHaveAttribute('aria-haspopup', 'true');
            expect(trigger).toHaveAttribute('aria-controls');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });
    });

    // ─── Open / close behavior ───────────────────────────────────

    describe('open & close', () => {
        it('opens menu on click', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            await screen.findByRole('button', { name: 'First' });
            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
        });

        it('closes on second click', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            await screen.findByRole('button', { name: 'First' });
            await userEvent.click(trigger);
            await waitFor(() => expect(screen.queryByRole('button', { name: 'First' })).not.toBeInTheDocument());
        });

        it('closes when item is clicked', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            const first = await screen.findByRole('button', { name: 'First' });
            await userEvent.click(first);
            await waitFor(() => expect(screen.queryByRole('button', { name: 'First' })).not.toBeInTheDocument());
        });

        it('keeps menu open if onClick calls preventDefault', async () => {
            const onClick = vi.fn((e: any) => e.preventDefault());
            render(() => (
                <MenuButton label="Open menu">
                    <MenuItem onClick={onClick}>First</MenuItem>
                </MenuButton>
            ));
            await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
            const first = await screen.findByRole('button', { name: 'First' });
            await userEvent.click(first);
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
        });
    });

    // ─── onOpen callback ─────────────────────────────────────────

    describe('onOpen', () => {
        it('fires onOpen with true when menu opens and false when it closes', async () => {
            const onOpen = vi.fn();
            const { trigger } = (() => {
                const result = render(() => (
                    <MenuButton label="Open menu" onOpen={onOpen}>
                        <MenuItem onClick={() => undefined}>First</MenuItem>
                        <MenuItem>Second</MenuItem>
                    </MenuButton>
                ));
                return { ...result, trigger: screen.getByRole('button', { name: 'Open menu' }) };
            })();
            await userEvent.click(trigger);
            expect(onOpen).toHaveBeenCalledWith(true);
            await userEvent.click(trigger);
            expect(onOpen).toHaveBeenCalledWith(false);
            expect(onOpen).toHaveBeenCalledTimes(2);
        });
    });

    // ─── Disabled items ──────────────────────────────────────────

    describe('disabled items', () => {
        it('renders disabled items with aria-disabled', async () => {
            render(() => (
                <MenuButton label="Open menu">
                    <MenuItem isDisabled>Disabled</MenuItem>
                    <MenuItem>Active</MenuItem>
                </MenuButton>
            ));
            await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
            const disabled = await screen.findByRole('button', { name: 'Disabled' });
            expect(disabled).toHaveAttribute('aria-disabled', 'true');
        });
    });
}
