import { defineComponent } from 'vue';

import { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS } from '@lumx/core/js/components/PopoverDialog';

import { getName } from '../../utils/VueToJSX';
import { IdsRegistryProvider } from '../../utils/IdsRegistryContext';
import PopoverDialogContent from './PopoverDialogContent';
import { emitSchema, POPOVER_DIALOG_PROP_KEYS } from './constants';
import type { PopoverDialogProps } from './types';

export type { PopoverDialogProps };
export { emitSchema };

const PopoverDialog = defineComponent(
    (props: PopoverDialogProps, { emit, slots, attrs }) => {
        const handleClose = () => emit('close');

        return () => (
            <IdsRegistryProvider>
                <PopoverDialogContent {...props} {...attrs} onClose={handleClose}>
                    {slots.default?.()}
                </PopoverDialogContent>
            </IdsRegistryProvider>
        );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: POPOVER_DIALOG_PROP_KEYS,
        emits: emitSchema,
    },
);

export default PopoverDialog;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };
