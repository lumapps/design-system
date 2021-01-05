import { Alignment, HorizontalAlignment } from '@lumx/react/components';
import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useChipGroupNavigation } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends GenericProps {
    /** Chip horizontal alignment. */
    align?: HorizontalAlignment;
    /** List of Chip. */
    children: React.ReactNode;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ChipGroupProps> = {
    align: Alignment.left,
};

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ChipGroup`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const InternalChipGroup: Comp<ChipGroupProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { align, children, className, ...forwardedProps } = props;
    const chipGroupClassName = handleBasicClasses({
        align,
        prefix: CLASSNAME,
    });

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, chipGroupClassName)}>
            {children}
        </div>
    );
});
InternalChipGroup.displayName = COMPONENT_NAME;
InternalChipGroup.className = CLASSNAME;
InternalChipGroup.defaultProps = DEFAULT_PROPS;

export const ChipGroup = Object.assign(InternalChipGroup, { useChipGroupNavigation });
