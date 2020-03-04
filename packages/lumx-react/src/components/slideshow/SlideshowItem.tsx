import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
 * Item of slideshow.
 *
 * @return The component.
 */
const SlideshowItem: React.FC<GenericProps> = ({ className = '', children, ...props }: GenericProps): ReactElement => (
    <div
        className={classNames(
            className,
            handleBasicClasses({
                prefix: CLASSNAME,
            }),
        )}
        {...props}
    >
        {children}
    </div>
);
SlideshowItem.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, SlideshowItem };
