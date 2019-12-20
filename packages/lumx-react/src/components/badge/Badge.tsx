import { Color } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';
import { ColorPalette } from '..';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IBaseBadgeProps extends IGenericProps {
    /**
     * Badge content.
     */
    children?: ReactNode;

    /**
     * The badge color.
     */
    color?: Color;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Badge`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IBaseBadgeProps = {
    color: ColorPalette.light,
};

const Badge: React.FC<IBaseBadgeProps> = ({
    color = DEFAULT_PROPS.color,
    className,
    ...props
}: IBaseBadgeProps): ReactElement => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color }))} {...props}>
            {props.children}
        </div>
    );
};

Badge.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Badge, IBaseBadgeProps };
