import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses, validateComponent } from '@lumx/react/utils';

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SlideshowItem`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

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
 * @return    The processed children of the component.
 */
function _validate(props: GenericProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 1,
        minChildren: 1,
        props,
    });
}

/////////////////////////////

/**
 * Item of slideshow.
 *
 * @return The component.
 */
const SlideshowItem: React.FC<GenericProps> = ({ className = '', children, ...props }: GenericProps): ReactElement => {
    const newChildren: ReactNode = _validate({ children, ...props });

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                }),
            )}
            {...props}
        >
            {newChildren}
        </div>
    );
};
SlideshowItem.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, SlideshowItem };
