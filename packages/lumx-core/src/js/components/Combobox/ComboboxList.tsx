import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { List } from '../List';

/**
 * Popup type for the combobox listbox.
 * - `'listbox'`: Standard listbox with `role="listbox"` and `role="option"` items.
 * - `'grid'`: Grid mode with `role="grid"` and `role="gridcell"` items, enabling 2D keyboard navigation.
 */
export type ComboboxListType = 'listbox' | 'grid';

/**
 * Defines the props for the core ComboboxList template.
 */
export interface ComboboxListProps extends HasClassName {
    /** Accessible label for the listbox (required for accessibility). */
    'aria-label'?: string;
    /**
     * Indicates that the listbox content is incomplete (loading).
     * Set to `true` when skeleton placeholders are present and no real options have loaded yet.
     * Omit (or set to `undefined`) when not loading — the attribute is not rendered as `"false"`.
     */
    'aria-busy'?: boolean;
    /** Content (should be ComboboxOption elements). */
    children?: JSXElement;
    /** The ID of the listbox element. */
    id?: string;
    /** ref to the root element */
    ref?: CommonRef;
    /**
     * The popup type. Set to "grid" when options have action buttons.
     * @default 'listbox'
     */
    type?: ComboboxListType;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxList';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-list';

/**
 * ComboboxList core template.
 * Renders a List with combobox-specific ARIA attributes and styling.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ComboboxList = (props: ComboboxListProps) => {
    const {
        'aria-label': ariaLabel,
        'aria-busy': ariaBusy,
        children,
        className,
        id,
        type = 'listbox',
        ref,
        ...forwardedProps
    } = props;

    return List({
        ...forwardedProps,
        className: classNames.join(className, CLASSNAME),
        ref,
        itemPadding: 'big',
        id,
        role: type,
        'aria-label': ariaLabel,
        'aria-busy': ariaBusy || undefined,
        children,
    } as any);
};
