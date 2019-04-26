import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}SlideshowItem`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
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
 * @param  {IGenericProps} props The children and props of the component.
 * @return {React.ReactNode}    The processed children of the component.
 */
function _validate(props: IGenericProps): React.ReactNode {
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
 * @return {React.ReactElement} The component.
 */
const SlideshowItem: React.FC<IGenericProps> = ({
    className = '',
    children,
    ...props
}: IGenericProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, ...props });

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
