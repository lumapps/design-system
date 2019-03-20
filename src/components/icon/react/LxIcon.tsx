import { Color, Colors, Size, Sizes } from 'LumX/components';
import { IGenericProps } from 'LumX/core/react/utils';

/////////////////////////////

import React from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The icon path to set in the <svg> `d` property
     */
    icon: string;

    /**
     * The icon color which must be defined by `lx-icon--${color}` CSS class.
     */
    color?: Color;

    /**
     * The icon size which must be defined by `lx-icon--${size}` CSS class.
     */
    size?: Size;
}
type LxIconProps = IProps;

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = 'lx-icon';

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the <LxIcon> component props.
 *
 * @param  {LxIconProps}   props The props of the <LxIcon> component.
 */
function _validate({ icon }: LxIconProps): void {
    if (isEmpty(icon)) {
        throw new Error('Your <LxIcon> must have an `icon` prop!');
    }
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxIconDefaultPropsType {
    color: Color;
    size: Size;
}

/**
 * The default value of props.
 *
 * @type {ILxIconDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxIconDefaultPropsType = {
    color: Colors.dark,
    size: Sizes.m,
};

/**
 * Displays an icon in the form of a HTML <svg> tag with the wanted icon path.
 *
 * @return {JSX.Element} The <LxIcon> component
 */
const LxIcon: React.FC<LxIconProps> = ({
    className,
    color = DEFAULT_PROPS.color,
    icon,
    size = DEFAULT_PROPS.size,
    ...props
}: LxIconProps): JSX.Element => {
    _validate({ color, icon, size, ...props });

    return (
        <i className={classNames(className, handleBasicClasses({ color, prefix: CLASSNAME, size }))} {...props}>
            <svg
                aria-hidden="true"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                style={{ verticalAlign: '-0.125em' }}
                viewBox="0 0 24 24"
                width="1em"
            >
                <path d={icon} fill="currentColor" />
            </svg>
        </i>
    );
};
LxIcon.displayName = 'LxIcon';

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, LxIcon, LxIconProps, Color, Colors, Size, Sizes };
