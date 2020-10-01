import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useChipGroupNavigation, useChipGroupNavigationType } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
interface ChipGroupProps extends GenericProps {
    /** The alignment of the component. */
    align?: string;
    /** The children elements to be transcluded into the component. Should be a list of Chip. */
    children: React.ReactNode;
}

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ChipGroupProps> = {
    align: 'left',
};

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ChipGroup`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

interface ChipGroup {
    useChipGroupNavigation: useChipGroupNavigationType;
}

/**
 * Displays a list of Chips in a grouped fashion.
 * @return The Chip Group component.
 */
const ChipGroup: React.FC<ChipGroupProps> & ChipGroup = ({
    align = DEFAULT_PROPS.align,
    children,
    className,
    ...forwardedProps
}) => {
    const chipGroupClassName = handleBasicClasses({
        align,
        prefix: CLASSNAME,
    });

    return (
        <div {...forwardedProps} className={classNames(className, chipGroupClassName)}>
            {children}
        </div>
    );
};

ChipGroup.displayName = COMPONENT_NAME;
ChipGroup.useChipGroupNavigation = useChipGroupNavigation;

export { CLASSNAME, ChipGroup, ChipGroupProps };
