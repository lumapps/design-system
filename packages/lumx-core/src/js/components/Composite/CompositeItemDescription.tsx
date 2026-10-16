import type { HasClassName, JSXElement } from '../../types';
import { getTextProps } from '../Text';

/** Props of the {@link CompositeItemDescription} template. */
export interface CompositeItemDescriptionProps extends HasClassName {
    /** ID of the description (the item action refers to it with `aria-describedby`). */
    id?: string;
    /** The description text. */
    children?: JSXElement;
    /** Extra attributes (e.g. the filter match text marker of a tree item). */
    [attribute: `data-${string}`]: string;
}

/**
 * Helper description of a composite item (an option or a tree item), rendered after the item action.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const CompositeItemDescription = ({ id, className, children, ...attributes }: CompositeItemDescriptionProps) => (
    <p id={id} {...attributes} {...getTextProps({ className, typography: 'caption', color: 'dark-L2' })}>
        {children}
    </p>
);
