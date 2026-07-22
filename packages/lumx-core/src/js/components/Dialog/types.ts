import type { JSXElement } from '../../types';
import type { Size } from '../../constants';

export interface BaseDialogProps {
    /** Footer content. */
    footer?: JSXElement;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceFooterDivider?: boolean;
    /** Header content. */
    header?: JSXElement;
    /** Whether the divider between the dialog content and the header is always displayed (instead of showing it on scroll). */
    forceHeaderDivider?: boolean;
    /** Whether the indefinite progress indicator over the dialog content is displayed or not. */
    isLoading?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
}

export type DialogSizes = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;
