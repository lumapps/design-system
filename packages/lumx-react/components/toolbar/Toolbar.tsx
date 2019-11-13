import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/core/react/constants';

import { IGenericProps, getRootClassName } from '@lumx/core/react/utils';
import { handleBasicClasses } from '@lumx/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IToolbarProps extends IGenericProps {
    /* Slot for the right element. */
    after?: ReactNode;
    /* Slot for the left element. */
    before?: ReactNode;
    /* Slot fo the main title element. */
    label?: ReactNode;
}
type ToolbarProps = IToolbarProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ToolbarProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Toolbar`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {};
/////////////////////////////

/**
 * Toolbar component.
 *
 * @return The component.
 */
const Toolbar: React.FC<ToolbarProps> = ({
    after,
    before,
    className = '',
    label,
    ...props
}: ToolbarProps): ReactElement => {
    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasAfter: Boolean(after),
                    hasBefore: Boolean(before),
                    hasLabel: Boolean(label),
                    prefix: CLASSNAME,
                }),
            )}
            {...props}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            {label && <div className={`${CLASSNAME}__label`}>{label}</div>}
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </div>
    );
};
Toolbar.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Toolbar, ToolbarProps };
