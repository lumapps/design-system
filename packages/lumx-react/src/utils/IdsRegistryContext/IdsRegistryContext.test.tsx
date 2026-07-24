import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';

import { IdsRegistryProvider, useRegisterId, useRegisteredId } from '.';

const NAME = 'dialog-label';

/** Reads the id registered under NAME and exposes it as `aria-labelledby`. */
const Reader = () => {
    const labelId = useRegisteredId(NAME);
    return <div data-testid="reader" aria-labelledby={labelId} />;
};

/** Registers an id under NAME while mounted. */
const Registrant = ({ id, name = NAME }: { id: string; name?: string }) => {
    useRegisterId(name, id);
    return <span id={id}>label</span>;
};

describe('IdsRegistryProvider / useRegisterId / useRegisteredId', () => {
    it('should not set an id when nothing is registered', () => {
        render(
            <IdsRegistryProvider>
                <Reader />
            </IdsRegistryProvider>,
        );
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });

    it('should expose an id registered by a sibling', () => {
        render(
            <IdsRegistryProvider>
                <Reader />
                <Registrant id="heading-1" />
            </IdsRegistryProvider>,
        );
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'heading-1');
    });

    it('should clear the id when the registrant unmounts', async () => {
        const Wrapper = () => {
            const [shown, setShown] = useState(true);
            return (
                <IdsRegistryProvider>
                    <Reader />
                    {shown && <Registrant id="heading-1" />}
                    <button type="button" onClick={() => setShown(false)}>
                        hide
                    </button>
                </IdsRegistryProvider>
            );
        };
        render(<Wrapper />);
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'heading-1');

        await userEvent.click(screen.getByRole('button', { name: 'hide' }));
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });

    it('should update the registered id when the registrant id changes', async () => {
        const Wrapper = () => {
            const [id, setId] = useState('initial');
            return (
                <IdsRegistryProvider>
                    <Reader />
                    <Registrant id={id} />
                    <button type="button" onClick={() => setId('updated')}>
                        change
                    </button>
                </IdsRegistryProvider>
            );
        };
        render(<Wrapper />);
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'initial');

        await userEvent.click(screen.getByRole('button', { name: 'change' }));
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'updated');
    });

    it('should be a no-op outside any provider', () => {
        render(<Reader />);
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });
});
