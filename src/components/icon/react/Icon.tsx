import React from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { Color, Colors, Size, Sizes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';
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
     * The icon color.
     */
    color?: Color;

    /**
     * The icon size.
     */
    size?: Size;
}
type IconProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IconProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Icon`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component before validating the children.
 *
 * @param {ValidateParameters} props The properties of the component.
 */
function _preValidate({ props }: ValidateParameters): void {
    if (!isEmpty(props.icon)) {
        return;
    }

    throw new Error(`<${COMPONENT_NAME}> must have an \`icon\` prop!`);
}

/**
 * Validate the component props.
 *
 * @param  {IconProps}       props The props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: IconProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        preValidate: _preValidate,
        props,
    });
}

/////////////////////////////

/**
 * Displays an icon in the form of a HTML <svg> tag with the wanted icon path.
 *
 * @return {JSX.Element} The component
 */
const Icon: React.FC<IconProps> = ({ className, color, icon, size, ...props }: IconProps): JSX.Element => {
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
Icon.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Icon, IconProps, Color, Colors, Size, Sizes };
