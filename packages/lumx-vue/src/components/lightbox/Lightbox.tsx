import { defineComponent } from 'vue';

import { COMPONENT_NAME } from '@lumx/core/js/components/Lightbox';
import { getName } from '../../utils/VueToJSX';

import { IdsRegistryProvider } from '../../utils/IdsRegistryContext';
import LightboxContent from './LightboxContent';
import { emitSchema, LIGHTBOX_PROP_KEYS } from './constants';
import type { LightboxProps } from './types';

export type { LightboxProps };
export { emitSchema };

const Lightbox = defineComponent(
    (props: LightboxProps, { emit, slots, attrs }) => {
        const handleClose = () => emit('close');

        return () => (
            <IdsRegistryProvider>
                <LightboxContent {...props} {...attrs} onClose={handleClose}>
                    {slots.default?.()}
                </LightboxContent>
            </IdsRegistryProvider>
        );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: LIGHTBOX_PROP_KEYS,
        emits: emitSchema,
    },
);

export default Lightbox;
