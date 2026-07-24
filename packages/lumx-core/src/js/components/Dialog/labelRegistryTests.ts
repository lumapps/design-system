import { waitFor } from '@testing-library/dom';

import { SetupOptions } from '../../../testing';

export interface LabelRegistrySetupOptions extends SetupOptions<any> {
    /** Framework factory producing a DialogHeading child carrying the given accessible name. */
    makeDialogHeading: (name: string) => any;
}

/**
 * Shared assertions proving a dialog-like container (`Dialog`, `Lightbox`, `PopoverDialog`) wires the
 * ids registry: it links itself to a rendered `DialogHeading` via `aria-labelledby`, and stays
 * unlabelled when none is present.
 *
 * The container's own precedence rules (explicit `aria-label`/`aria-labelledby`/`label` props), the
 * unmount behaviour, and any framework-specific concerns (e.g. Vue stray-attribute leaks) stay in the
 * per-package test files. Registry mechanics (last-wins, fallback) are covered by the IdsRegistry
 * tests.
 *
 * `aria-label` is forced to `undefined` because some containers default it, which would otherwise win
 * over the registry-provided `aria-labelledby`.
 */
export const DialogLabelRegistryTests = (renderOptions: LabelRegistrySetupOptions) => {
    const { render, screen, makeDialogHeading } = renderOptions;

    describe('DialogHeading label registry wiring', () => {
        it('should link the container via aria-labelledby when a DialogHeading is rendered', async () => {
            render({ 'aria-label': undefined, children: makeDialogHeading('My title') });
            const heading = screen.getByRole('heading', { name: 'My title' });
            const dialog = screen.getByRole('dialog');
            // The registry notifies the container asynchronously in Vue (watcher/nextTick);
            // waitFor covers both the synchronous (React) and asynchronous (Vue) cases.
            await waitFor(() => expect(dialog).toHaveAttribute('aria-labelledby', heading.id));
        });

        it('should not set aria-labelledby when no DialogHeading is rendered', () => {
            render({ 'aria-label': undefined });
            expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
        });
    });
};
