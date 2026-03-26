import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ListItem } from '../List/ListItem';
import { ListItemAction } from '../List/ListItemAction';
import { getTextProps } from '../Text';

/**
 * Injected framework-specific components for ComboboxOption rendering.
 */
export interface ComboboxOptionComponents {
    /** Tooltip wrapper component (optional). Used when `tooltipProps` is provided. */
    Tooltip?: any;
}

/**
 * Defines the props for the core ComboboxOption template.
 */
export interface ComboboxOptionProps extends HasClassName {
    /** A component to be rendered before the content (e.g. an icon or avatar). */
    before?: JSXElement;
    /** A component to be rendered after the content (e.g. ComboboxOptionAction elements). */
    after?: JSXElement;
    /** Content (option label). */
    children?: JSXElement;
    /** Props forwarded to a Tooltip wrapping the role="option" / role="gridcell" element. */
    tooltipProps?: Record<string, any>;
    /** Helper description. */
    description?: string;
    /** Unique ID for the option element. */
    id?: string;
    /** Unique ID for the description element (for aria-describedby). */
    descriptionId?: string;
    /** Whether the option is disabled. */
    isDisabled?: boolean;
    /** Whether the option is selected. */
    isSelected?: boolean;
    /** Whether the parent list is in grid mode. */
    isGrid?: boolean;
    /**
     * Whether the option is hidden (filtered out by auto-filter).
     * When true, renders a bare `<li hidden>` with only the children text — no ARIA roles,
     * no classes, no visual structure. This keeps the element in the DOM so its textContent
     * can be read for future filter evaluations, while naturally excluding it from
     * `[role="option"]` queries (focus navigation) and `.lumx-combobox-option` CSS rules
     * (section/popover auto-hide).
     */
    hidden?: boolean;
    /** On click callback. */
    handleClick?(): void;
    /** ref to the root <li> element. */
    ref?: CommonRef;
    /** The value for this option (used for selection). */
    value?: string;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 * Used by `ReactToJSX<ComboboxOptionProps, ComboboxOptionPropsToOverride>`.
 */
export type ComboboxOptionPropsToOverride = 'before' | 'after' | 'children' | 'tooltipProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxOption';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-option';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * ComboboxOption core template.
 * Renders a ListItem with combobox-specific ARIA attributes and structure.
 *
 * In grid mode, the ListItem renders with `role="row"` and the option content
 * uses `role="gridcell"` instead of `role="option"`.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ComboboxOption = (props: ComboboxOptionProps, { Tooltip }: ComboboxOptionComponents = {}) => {
    const {
        before,
        after,
        children,
        className,
        description,
        descriptionId,
        hidden,
        id,
        isDisabled,
        isGrid,
        isSelected,
        handleClick,
        ref,
        tooltipProps,
        value,
        ...forwardedProps
    } = props;

    let actionRole;
    let itemRole;
    if (!hidden) {
        actionRole = isGrid ? 'gridcell' : 'option';
        itemRole = isGrid ? 'row' : 'none';
    }

    const actionElement = ListItemAction({
        as: 'p' as any,
        id,
        className: element('trigger'),
        handleClick,
        'aria-selected': isSelected ? 'true' : 'false',
        'data-value': value,
        'aria-describedby':
            [description && descriptionId, id && `${id}-more-info`].filter(Boolean).join(' ') || undefined,
        'aria-disabled': isDisabled ? 'true' : undefined,
        role: actionRole,
        children,
    } as any);

    const wrappedAction =
        Tooltip && tooltipProps && !hidden ? <Tooltip {...tooltipProps}>{actionElement}</Tooltip> : actionElement;

    return ListItem({
        ref,
        size: 'tiny',
        ...forwardedProps,
        hidden,
        className: !hidden ? classNames.join(className, block()) : undefined,
        before,
        after,
        role: itemRole,
        children: (
            <>
                {wrappedAction}

                {description && (
                    <p
                        id={descriptionId}
                        {...getTextProps({
                            className: element('description'),
                            typography: 'caption',
                            color: 'dark-L2',
                        })}
                    >
                        {description}
                    </p>
                )}
            </>
        ),
    } as any);
};
