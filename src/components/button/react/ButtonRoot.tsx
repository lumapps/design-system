import React, { ReactElement, ReactNode, RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, validateComponent } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * Button reference to handle focus, ...
     */
    buttonRef?: RefObject<HTMLElement>;

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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonRoot`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    buttonRef: undefined,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param props The children and props of the component.
 * @return The processed children of the component.
 */
function _validate(props: ButtonRootProps): ReactNode {
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
 * @return The component.
 */
const ButtonRoot: React.FC<ButtonRootProps> = ({
    buttonRef = DEFAULT_PROPS.buttonRef,
    children,
    className,
    href,
    target,
    ...props
}: ButtonRootProps): ReactElement => {
    const newChildren: ReactNode = _validate({ children, ...props });

    if (isEmpty(href)) {
        return (
            <button ref={buttonRef as RefObject<HTMLButtonElement>} className={className} {...props}>
                {newChildren}
            </button>
        );
    }

    return (
        <a ref={buttonRef as RefObject<HTMLAnchorElement>} className={className} href={href} target={target} {...props}>
            {newChildren}
        </a>
    );
};
ButtonRoot.displayName = COMPONENT_NAME;

/////////////////////////////

export { DEFAULT_PROPS, ButtonRoot, ButtonRootProps };
