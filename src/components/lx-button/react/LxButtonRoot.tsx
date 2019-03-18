import React, { Children } from 'react';

import isEmpty from 'lodash/isEmpty';

/////////////////////////////

/**
 * Defines the props of the <LxButtonRoot> component.
 */
interface ILxButtonRootProps {
    /**
     * Basic react `children` prop.
     */
    children: React.ReactNode;

    /**
     * Basic react `className` prop.
     */
    className?: string;

    /**
     * Indicates if the button is disabled or not.
     */
    disabled?: boolean;

    /**
     * The `href` to reach if there is one.
     */
    href?: string;

    /**
     * The `target` to open the `href` into.
     */
    target?: string;
}
type LxButtonRootProps = ILxButtonRootProps;

/////////////////////////////

/**
 * The root of the <LxButton> component.
 * Conditionnaly adds a `<a>` or a `<button>` HTML tag whether there is an `href` attribute or not.
 *
 * @return {JSX.Element} The <LxButton> root component.
 */
const LxButtonRoot: React.FC<LxButtonRootProps> = ({
    href,
    children,
    target,
    className,
    ...props
}: LxButtonRootProps): JSX.Element => {
    const childrenCount: number = Children.count(children);
    if (childrenCount === 0) {
        throw new Error('<LxButtonRoot> must have at least 1 child (got 0)!');
    }

    if (isEmpty(href)) {
        return (
            <button className={className} {...props}>
                {children}
            </button>
        );
    }

    return (
        <a href={href} target={target} className={className} {...props}>
            {children}
        </a>
    );
};
LxButtonRoot.displayName = 'LxButtonRoot';

/////////////////////////////

export { LxButtonRoot, LxButtonRootProps };
