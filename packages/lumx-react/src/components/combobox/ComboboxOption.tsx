import { ElementType, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { GenericProps } from '@lumx/core/js/types';
import {
    ComboboxOption as UI,
    ComboboxOptionProps as UIProps,
    ComboboxOptionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOption';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useId } from '@lumx/react/hooks/useId';
import { Tooltip, TooltipProps } from '../tooltip';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxListContext } from './context/ComboboxListContext';
import { ComboboxOptionContext } from './context/ComboboxOptionContext';

/**
 * Props forwarded to the inner action element (button or link).
 */
export type ComboboxOptionActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> & HasRequiredLinkHref<E>;

/**
 * Props for Combobox.Option component.
 */
export interface ComboboxOptionProps extends GenericProps, ReactToJSX<UIProps, ComboboxOptionPropsToOverride> {
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
    actionProps?: ComboboxOptionActionProps<any>;
}

/**
 * Combobox.Option component - wraps ListItem with option role and data-value.
 *
 * When autoFilter is enabled on the parent Combobox.Input, each option registers itself
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
export const ComboboxOption = forwardRef<ComboboxOptionProps, HTMLLIElement>((props, ref) => {
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
    const { type } = useComboboxListContext();
    const { handle } = useComboboxContext();
    const isGrid = type === 'grid';
    const optionId = useId();
    const descriptionId = useId();
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const [isFiltered, setIsFiltered] = useState(false);

    useEffect(() => {
        const element = internalRef.current;
        if (!element || !handle) return undefined;
        return handle.registerOption(element, setIsFiltered);
    }, [handle]);

    // Wrap `after` content in an option context so sub-components (e.g. OptionMoreInfo)
    // can access the parent option's ID for keyboard highlight detection.
    const optionContextValue = useMemo(() => ({ optionId }), [optionId]);
    const wrappedAfter = after ? (
        <ComboboxOptionContext.Provider value={optionContextValue}>{after}</ComboboxOptionContext.Provider>
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
            tooltipProps,
        },
        { Tooltip },
    );
});

ComboboxOption.displayName = COMPONENT_NAME;
ComboboxOption.className = CLASSNAME;
