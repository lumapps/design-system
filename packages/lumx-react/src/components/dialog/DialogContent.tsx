import { ReactElement } from 'react';

import {
    DialogContent as CoreDialogContent,
    type DialogContentProps as CoreDialogContentProps,
} from '@lumx/core/js/components/Dialog';
import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';

import { useRegisteredId } from '@lumx/react/utils/IdsRegistryContext';

/**
 * Renders the core `DialogContent`, resolving its `aria-labelledby` from the ids registry.
 *
 * Must render as a descendant of the `IdsRegistryProvider` set up by the core `DialogShell` (which is
 * why it is its own component: the subscription hook needs to run below the provider). Internal to the
 * dialog family - not exported from the package barrel.
 */
export const DialogContent = (props: Omit<CoreDialogContentProps, 'labelId'>): ReactElement => {
    const labelId = useRegisteredId(DIALOG_LABEL_KEY);
    return CoreDialogContent({ ...props, labelId }) as ReactElement;
};
DialogContent.displayName = 'DialogContent';
