import { Alignment } from '@lumx/react/components';
import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useChipGroupNavigation, useChipGroupNavigationType } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends GenericProps {
    /** The alignment of the component. */
    align?: string;
    /** The children elements. Should be a list of Chip. */
    children: React.ReactNode;
}

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ChipGroupProps> = {
    align: Alignment.left,
};

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ChipGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ChipGroup: Comp<ChipGroupProps, HTMLDivElement> & {
    useChipGroupNavigation?: useChipGroupNavigationType;
} = forwardRef((props, ref) => {
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
ChipGroup.displayName = COMPONENT_NAME;
ChipGroup.className = CLASSNAME;
ChipGroup.defaultProps = DEFAULT_PROPS;
ChipGroup.useChipGroupNavigation = useChipGroupNavigation;
