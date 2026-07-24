/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { render, screen } from '@testing-library/vue';

import { IdsRegistryProvider, useRegisterId, useRegisteredId } from '.';

const NAME = 'dialog-label';

/** Reads the id registered under NAME and exposes it as `aria-labelledby`. */
const Reader = defineComponent({
    setup() {
        const labelId = useRegisteredId(NAME);
        return () => <div data-testid="reader" aria-labelledby={labelId.value} />;
    },
});

/** Registers an id under a name while mounted. */
const Registrant = defineComponent({
    props: {
        id: { type: String, required: false, default: undefined },
        name: { type: String, required: false, default: NAME },
    },
    setup(props) {
        useRegisterId(props.name, () => props.id);
        return () => <span id={props.id}>label</span>;
    },
});

describe('IdsRegistryProvider / useRegisterId / useRegisteredId', () => {
    it('should not set an id when nothing is registered', () => {
        render(<IdsRegistryProvider>{() => <Reader />}</IdsRegistryProvider>);
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });

    it('should expose an id registered by a sibling', async () => {
        render(<IdsRegistryProvider>{() => [<Reader />, <Registrant id="heading-1" />]}</IdsRegistryProvider>);
        await nextTick();
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'heading-1');
    });

    it('should clear the id when the registrant unmounts', async () => {
        const shown = ref(true);
        render(
            <IdsRegistryProvider>
                {() => [<Reader />, shown.value ? <Registrant id="heading-1" /> : null]}
            </IdsRegistryProvider>,
        );
        await nextTick();
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'heading-1');

        shown.value = false;
        await nextTick();
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });

    it('should update the registered id reactively', async () => {
        const id = ref('initial');
        const ReactiveRegistrant = defineComponent({
            setup() {
                useRegisterId(NAME, () => id.value);
                return () => <span />;
            },
        });
        render(<IdsRegistryProvider>{() => [<Reader />, <ReactiveRegistrant />]}</IdsRegistryProvider>);
        await nextTick();
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'initial');

        id.value = 'updated';
        await nextTick();
        expect(screen.getByTestId('reader')).toHaveAttribute('aria-labelledby', 'updated');
    });

    it('should be a no-op outside any provider', () => {
        render(<Reader />);
        expect(screen.getByTestId('reader')).not.toHaveAttribute('aria-labelledby');
    });
});
