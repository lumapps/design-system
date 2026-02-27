import type { HasAriaLabelOrLabelledBy, LumxClassName } from '../../types';
import type { PopoverProps } from '../Popover';

/**
 * PopoverDialog props.
 * The PopoverDialog has the same props as the Popover but requires an accessible label.
 */
export type PopoverDialogProps = PopoverProps &
    HasAriaLabelOrLabelledBy & {
        /** Accessible label for the dialog (alternative to aria-label prop). */
        label?: string;
    };

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'PopoverDialog';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-popover-dialog';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<PopoverDialogProps> = {};
