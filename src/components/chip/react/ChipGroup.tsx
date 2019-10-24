import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

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
const COMPONENT_NAME = `${COMPONENT_PREFIX}Chip`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/////////////////////////////

/**
 * Displays information or allow an action on a compact element.
 * This is the base component for all variations of the chips see https://material.io/design/components/chips.html.
 *
 * @return The Chip Group component.
 */
const ChipGroup: React.FC<IChipGroupProps> = ({
    className,
    align = DEFAULT_PROPS.align,
    children,
    ...props
}: ChipGroupProps): ReactElement => {
    const chipGroupClassName = classNames(
        `${CSS_PREFIX}-chip-group`,
        `${CSS_PREFIX}-chip-group--align-${align}`,
        className,
    );

    return (
        <div className={chipGroupClassName} {...props}>
            {children}
        </div>
    );
};

ChipGroup.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, ChipGroup, ChipGroupProps };
