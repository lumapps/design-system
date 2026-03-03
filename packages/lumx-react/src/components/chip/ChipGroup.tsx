import { ReactNode } from 'react';

import {
    ChipGroup as UI,
    ChipGroupProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Chip/ChipGroup';
import { GenericProps } from '@lumx/react/utils/type';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useChipGroupNavigation } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends GenericProps, ReactToJSX<UIProps, never> {
    /** List of Chip. */
    children: ReactNode;
}

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalChipGroup = forwardRef<ChipGroupProps, HTMLDivElement>((props, ref) => {
    const { children, ...forwardedProps } = props;

    return UI({
        ref,
        children,
        ...forwardedProps,
    });
});
InternalChipGroup.displayName = COMPONENT_NAME;
InternalChipGroup.className = CLASSNAME;
InternalChipGroup.defaultProps = DEFAULT_PROPS;

export const ChipGroup = Object.assign(InternalChipGroup, { useChipGroupNavigation });
