import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

import React, { Children } from 'react';

import isEmpty from 'lodash/isEmpty';

/////////////////////////////

/**
 * Defines the props of the <LxButtonRoot> component.
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
type LxButtonRootProps = IProps;

/////////////////////////////

/**
 * The root of the <LxButton> component.
 * Conditionnaly adds a `<a>` or a `<button>` HTML tag whether there is an `href` attribute or not.
 *
 * @return {JSX.Element} The <LxButton> root component.
 */
const LxButtonRoot: React.FC<LxButtonRootProps> = ({
    children,
    href,
    target,
    ...props
}: LxButtonRootProps): JSX.Element => {
    const childrenCount: number = Children.count(children);
    if (childrenCount === 0) {
        throw new Error('<LxButtonRoot> must have at least 1 child (got 0)!');
    }

    if (isEmpty(href)) {
        return <button {...props}>{children}</button>;
    }

    return (
        <a href={href} target={target} {...props}>
            {children}
        </a>
    );
};
LxButtonRoot.displayName = 'LxButtonRoot';

/////////////////////////////

export { LxButtonRoot, LxButtonRootProps };
