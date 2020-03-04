import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useChipGroupNavigation, useChipGroupNavigationType } from '@lumx/react/hooks/useChipGroupNavigation';

/**
 * Defines the props of the component.
 */
interface ChipGroupProps extends GenericProps {
    /** Children of the ChipGroup. This should be a list of Chips */
    children: React.ReactNode;

    /** Chip group alignment */
    align?: string;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ChipGroupProps> {}

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
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
    className,
    align = DEFAULT_PROPS.align,
    children,
    ...props
}) => {
    const chipGroupClassName = handleBasicClasses({
        align,
        prefix: CLASSNAME,
    });

    return (
        <div className={classNames(className, chipGroupClassName)} {...props}>
            {children}
        </div>
    );
};

ChipGroup.displayName = COMPONENT_NAME;
ChipGroup.useChipGroupNavigation = useChipGroupNavigation;

export { CLASSNAME, ChipGroup, ChipGroupProps };
