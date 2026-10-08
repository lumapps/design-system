import { ElementType, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { GenericProps } from '@lumx/core/js/types';
import {
    ListboxOption as UI,
    ListboxOptionProps as UIProps,
    ListboxOptionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOption';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useId } from '@lumx/react/hooks/useId';
import { optionActiveEvent } from '@lumx/core/js/components/Listbox/constants';
import { Tooltip, TooltipProps } from '../tooltip';
import { useListboxContext } from './context/ListboxContext';
import { ListboxOptionContext } from './context/ListboxOptionContext';
import { useListboxEvent } from './context/useListboxEvent';

/**
 * Props forwarded to the inner action element (button or link).
 */
export type ListboxOptionActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> & HasRequiredLinkHref<E>;

/**
 * Props for Combobox.Option component.
 */
export interface ListboxOptionProps extends GenericProps, ReactToJSX<UIProps, ListboxOptionPropsToOverride> {
    /** Display label for the option. */
    children?: ReactNode;
    /** On option clicked (or activated with keyboard) */
    onClick?(): void;
    /** Content rendered before the option label (e.g. an icon or avatar). */
    before?: ReactNode;
    /**
     * Content rendered after the option label.
     * In grid mode (`type="grid"` on the parent Combobox.List), use `Combobox.OptionAction` elements here
     * to add secondary action buttons. Each action becomes an independent `role="gridcell"`.
     */
    after?: ReactNode;
    /** Props forwarded to a Tooltip wrapping the role="option" / role="gridcell" trigger element. */
    tooltipProps?: Partial<TooltipProps>;
    /** Props forwarded to the inner action element (e.g. `{ as: 'a', href: '/foo' }`). */
    actionProps?: ListboxOptionActionProps<any>;
}

/**
 * Combobox.Option component - wraps ListItem with option role and data-value.
 *
 * When filter="auto" is enabled on the parent Combobox.Input, each option registers itself
 * with the combobox handle (via an internal ref to its root <li>). When the filter changes,
 * the handle calls back with the new match state. When filtered out, the core template renders
 * a bare `<li hidden>` — no ARIA roles, no CSS classes — keeping the element in the DOM so
 * its textContent remains readable for future filter evaluations.
 *
 * In grid mode (`type="grid"` on the parent Combobox.List), the ListItem renders with `role="row"`
 * and the option content uses `role="gridcell"` instead of `role="option"`.
 * Use `after` to pass `Combobox.OptionAction` elements as secondary action gridcells.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const ListboxOption = forwardRef<ListboxOptionProps, HTMLLIElement>((props, ref) => {
    const {
        value,
        description,
        children,
        isSelected,
        isDisabled,
        before,
        after,
        tooltipProps,
        actionProps,
        onClick,
        ...forwardedProps
    } = props;
    const { type, list } = useListboxContext();
    const isGrid = type === 'grid';
    const optionId = useId();
    const descriptionId = useId();
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const [isFiltered, setIsFiltered] = useState(false);

    // Force the tooltip open while the option is the active descendant (keyboard highlight).
    const isActive = useListboxEvent(list, optionActiveEvent(optionId), false);

    useEffect(() => {
        const element = internalRef.current;
        if (!element || !list) return undefined;
        return list.registerOption(element, setIsFiltered);
    }, [list]);

    // Re-evaluate filter state when the option value changes.
    useEffect(() => {
        const element = internalRef.current;
        if (!element || !list) return;
        list.refilterOption(element);
    }, [list, value]);

    // Wrap `after` content in an option context so sub-components (e.g. OptionMoreInfo)
    // can access the parent option's ID for keyboard highlight detection.
    const optionContextValue = useMemo(() => ({ optionId, isSelected: Boolean(isSelected) }), [optionId, isSelected]);
    const wrappedAfter = after ? (
        <ListboxOptionContext.Provider value={optionContextValue}>{after}</ListboxOptionContext.Provider>
    ) : undefined;

    return UI(
        {
            ...forwardedProps,
            ref: mergedRef,
            actionProps,
            hidden: isFiltered,
            value,
            description,
            children,
            isSelected,
            isDisabled,
            isGrid,
            before,
            after: wrappedAfter,
            handleClick: onClick,
            id: optionId,
            descriptionId,
            tooltipProps: tooltipProps && { ...tooltipProps, forceOpen: tooltipProps.forceOpen || isActive },
        },
        { Tooltip },
    );
});

ListboxOption.displayName = COMPONENT_NAME;
ListboxOption.className = CLASSNAME;
