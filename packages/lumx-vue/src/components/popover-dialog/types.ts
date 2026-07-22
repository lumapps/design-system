import { type PopoverDialogProps as CorePopoverDialogProps } from '@lumx/core/js/components/PopoverDialog';
import type { PopoverProps as CorePopoverProps } from '@lumx/core/js/components/Popover';

import { type PopoverProps } from '../popover/Popover';

/**
 * Vue PopoverDialog props.
 * Extends the Vue Popover props with dialog-specific accessible label props from core.
 * An accessible name can be provided via `label`/`aria-label`/`aria-labelledby`, or by rendering
 * a `DialogHeading` inside the dialog - at least one of these should be used.
 */
export type PopoverDialogProps = PopoverProps & Omit<CorePopoverDialogProps, keyof CorePopoverProps>;
