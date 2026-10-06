import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ListItem } from '../List/ListItem';
import { ListItemAction } from '../List/ListItemAction';
import { getTextProps } from '../Text';

/**
 * Injected framework-specific components for ListboxOption rendering.
 */
export interface ListboxOptionComponents {
    /** Tooltip wrapper component (optional). Used when `tooltipProps` is provided. */
    Tooltip?: any;
}

/**
 * Defines the props for the core ListboxOption template.
 */
export interface ListboxOptionProps extends HasClassName {
    /** A component to be rendered before the content (e.g. an icon or avatar). */
    before?: JSXElement;
    /** A component to be rendered after the content (e.g. ListboxOptionAction elements). */
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
     * `[role="option"]` queries (focus navigation) and `.lumx-listbox-option` CSS rules
     * (section/popover auto-hide).
     */
    hidden?: boolean;
    /** On click callback. */
    handleClick?(): void;
    /** Extra props forwarded to the inner action element (e.g. link props when as="a"). */
    actionProps?: Record<string, any>;
    /** ref to the root <li> element. */
    ref?: CommonRef;
    /** The value for this option (used for selection). */
    value?: string;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 * Used by `ReactToJSX<ListboxOptionProps, ListboxOptionPropsToOverride>`.
 */
export type ListboxOptionPropsToOverride = 'before' | 'after' | 'children' | 'tooltipProps' | 'actionProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListboxOption';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-listbox-option';
/**
 * Legacy class name, emitted next to `CLASSNAME` for backward compatibility.
 *
 * @deprecated Use `CLASSNAME` (`lumx-listbox-*`). The legacy `lumx-combobox-*` class will be removed in the next major version.
 */
export const LEGACY_CLASSNAME = 'lumx-combobox-option';
const { block, element } = classNames.bem(CLASSNAME);
const legacy = classNames.bem(LEGACY_CLASSNAME);

/**
 * ListboxOption core template.
 * Renders a ListItem with combobox-specific ARIA attributes and structure.
 *
 * In grid mode, the ListItem renders with `role="row"` and the option content
 * uses `role="gridcell"` instead of `role="option"`.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ListboxOption = (props: ListboxOptionProps, { Tooltip }: ListboxOptionComponents = {}) => {
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
        actionProps,
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
        as: 'button',
        ...actionProps,
        // Focus stays on the focus owner (combobox trigger or standalone listbox), never on the option.
        tabIndex: -1,
        id,
        className: classNames.join(element('action'), legacy.element('action')),
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
        className: !hidden ? classNames.join(className, block(), legacy.block()) : undefined,
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
                            className: classNames.join(element('description'), legacy.element('description')),
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
