import type { AriaAttributes, LumxClassName } from '../../types';
import type { PopoverProps } from '../Popover';

/**
 * PopoverDialog props.
 * The PopoverDialog has the same props as the Popover, plus optional accessible-name props.
 * An accessible name can be provided via `label`, `aria-label`, `aria-labelledby`, or by
 * rendering a `DialogHeading` inside the dialog (which names it via the internal label
 * registry) - at least one of these should be used.
 */
export type PopoverDialogProps = PopoverProps &
    Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'> & {
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
