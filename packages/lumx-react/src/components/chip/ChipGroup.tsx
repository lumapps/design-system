import { Alignment } from '@lumx/react/components';
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

interface ChipGroup {
    useChipGroupNavigation: useChipGroupNavigationType;
}

const ChipGroup: React.FC<ChipGroupProps> & ChipGroup = ({ align, children, className, ...forwardedProps }) => {
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
ChipGroup.defaultProps = DEFAULT_PROPS;
ChipGroup.useChipGroupNavigation = useChipGroupNavigation;

export { CLASSNAME, ChipGroup, ChipGroupProps };
