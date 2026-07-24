import { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS } from '@lumx/core/js/components/PopoverDialog';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { IdsRegistryProvider } from '@lumx/react/utils/IdsRegistryContext';

import { PopoverDialogContent, type PopoverDialogProps } from './PopoverDialogContent';

export type { PopoverDialogProps };

/**
 * PopoverDialog component.
 * Defines a popover that acts like a dialog:
 * - Has a dialog aria role
 * - Sets a focus trap within the popover
 * - Closes on click away and escape
 * - Resets heading level context to 2
 */
export const PopoverDialog = forwardRef<PopoverDialogProps, HTMLDivElement>((props, ref) => (
    <IdsRegistryProvider>
        <PopoverDialogContent {...props} ref={ref} />
    </IdsRegistryProvider>
));

PopoverDialog.displayName = COMPONENT_NAME;
PopoverDialog.className = CLASSNAME;
PopoverDialog.defaultProps = DEFAULT_PROPS as Partial<PopoverDialogProps>;
