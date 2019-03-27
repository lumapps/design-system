import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, validateComponent } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The `href` to reach if there is one.
     */
    href?: string;

    /**
     * The `target` to open the `href` into.
     */
    target?: string;
}
type ButtonRootProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ButtonRootProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ButtonRoot`;

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
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {ButtonRootProps} props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: ButtonRootProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        minChildren: 1,
        props,
    });
}

/////////////////////////////

/**
 * The root of the <Button> component.
 * Conditionally adds a `<a>` or a `<button>` HTML tag whether there is an `href` attribute or not.
 *
 * @return {React.ReactElement} The component.
 */
const ButtonRoot: React.FC<ButtonRootProps> = ({
    children,
    className,
    href,
    target,
    ...props
}: ButtonRootProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, ...props });

    if (isEmpty(href)) {
        return (
            <button className={className} {...props}>
                {newChildren}
            </button>
        );
    }

    return (
        <a className={className} href={href} target={target} {...props}>
            {newChildren}
        </a>
    );
};
ButtonRoot.displayName = COMPONENT_NAME;

/////////////////////////////

export { DEFAULT_PROPS, ButtonRoot, ButtonRootProps };
