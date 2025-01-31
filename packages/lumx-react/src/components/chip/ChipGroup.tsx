import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { HorizontalAlignment } from '@lumx/react/components';
import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useChipGroupNavigation } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends GenericProps {
    /**
     * Chip horizontal alignment.
     * @deprecated
     */
    align?: HorizontalAlignment;
    /** List of Chip. */
    children: ReactNode;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ChipGroupProps> = {};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ChipGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-chip-group';

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalChipGroup = forwardRef<ChipGroupProps, HTMLDivElement>((props, ref) => {
    const { align, children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
        </div>
    );
});
InternalChipGroup.displayName = COMPONENT_NAME;
InternalChipGroup.className = CLASSNAME;
InternalChipGroup.defaultProps = DEFAULT_PROPS;

export const ChipGroup = Object.assign(InternalChipGroup, { useChipGroupNavigation });
