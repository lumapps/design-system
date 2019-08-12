import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Size } from 'LumX/components';
import { Lightbox } from 'LumX/components/lightbox/react/Lightbox';
import useIntersectionObserver from 'LumX/core/react/hooks/useIntersectionObserver';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDialogProps extends IGenericProps {}
type DialogProps = IDialogProps;

type DialogSizes = Size.tiny | Size.regular | Size.big | Size.huge;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Dialog`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DialogProps> = {};
/////////////////////////////

/**
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const Dialog: React.FC<DialogProps> = ({
    children,
    className = '',
    header,
    footer,
    isOpen,
    onOpen,
    onClose,
    parentElement,
    ...props
}: DialogProps): ReactElement => {
    const [sentinel1, sentinel1Intersec] = useIntersectionObserver({ rootMargin: '0px', threshold: [0.0, 1.0] });
    const [sentinel2, sentinel2Intersec] = useIntersectionObserver({ rootMargin: '0px', threshold: [0.0, 1.0] });


    if(sentinel1Intersec)
        console.log("sentinel1Intersec", sentinel1Intersec.intersectionRatio);
    if(sentinel2Intersec)
        console.log("sentinel2Intersec", sentinel2Intersec.intersectionRatio);
     

    return (
        <Lightbox
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            parentElement={parentElement}
            isCloseButtonVisible={false}
        >
            <div role="dialog" className="lumx-dialog lumx-dialog--size-regular" style={{ display: 'block' }}>
                {isOpen && (
                    <div className="lumx-dialog__wrapper">
                        <div className="lumx-dialog__header">{header}</div>
                        <div className="lumx-dialog__content">
                            <div className="lumx-dialog__sentinel lumx-dialog__sentinel--top" ref={sentinel1} />
                            <div>{children}</div>
                            <div className="lumx-dialog__sentinel lumx-dialog__sentinel--bottom" ref={sentinel2} />
                        </div>
                        <div className="lumx-dialog__footer">{footer}</div>
                    </div>
                )}
            </div>
        </Lightbox>
    );
};
Dialog.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dialog, DialogProps, DialogSizes };
