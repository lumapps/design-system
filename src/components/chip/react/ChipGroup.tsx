import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { useChipGroupNavigation, useChipGroupNavigationType } from 'LumX/core/react/hooks';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IChipGroupProps extends IGenericProps {
    /** Children of the ChipGroup. This should be a list of Chips */
    children: React.ReactNode;

    /** Chip group alignment */
    align?: string;
}
type ChipGroupProps = IChipGroupProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ChipGroupProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
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

interface IChipGroup {
    useChipGroupNavigation: useChipGroupNavigationType;
}

/////////////////////////////

/**
 * Displays a list of Chips in a grouped fashion.
 * @return The Chip Group component.
 */
const ChipGroup: React.FC<IChipGroupProps> & IChipGroup = ({
    className,
    align = DEFAULT_PROPS.align,
    children,
    ...props
}: ChipGroupProps): ReactElement => {
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

/////////////////////////////

export { CLASSNAME, ChipGroup, ChipGroupProps };
