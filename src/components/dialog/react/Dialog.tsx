import React, { ReactElement, RefObject } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Progress, ProgressVariant, Size, Theme } from 'LumX';
import { Lightbox } from 'LumX/components/lightbox/react/Lightbox';
import useIntersectionObserver from 'LumX/core/react/hooks/useIntersectionObserver';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDialogProps extends IGenericProps {
    /** Element(s) to display in the footer part */
    footer: ReactElement;
    /** Element(s) to display in the header part */
    header: ReactElement;
    /** Whether the dialog is loading. */
    isLoading?: boolean;
    /** Status of the dialog. */
    isOpen?: boolean;
    /** Ref of element that triggered modal opening to set focus on. */
    // tslint:disable-next-line: no-any
    parentElement: RefObject<any>;
    /** Prevent clickaway and escape to dismiss the lightbox */
    preventAutoClose?: boolean;
    /** Theme. */
    theme?: Theme;
    /** Size of the dialog */
    size?: DialogSizes;
    /** Callback called when lightbox is closing. */
    onClose?(): void;
    /** Callback called when lightbox is opening. */
    onOpen?(): void;
}
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
const DEFAULT_PROPS: Partial<DialogProps> = {
    preventAutoClose: false,
    size: Size.big,
};
/////////////////////////////

/**
 * Prevent click bubbling to parent.
 *
 * @param evt Click event.
 */
const preventClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    evt.stopPropagation();
};

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
    isLoading,
    isOpen,
    onOpen,
    onClose,
    parentElement,
    preventAutoClose = DEFAULT_PROPS.preventAutoClose,
    size = DEFAULT_PROPS.size,
    theme,
}: DialogProps): ReactElement => {
    const [sentinel1, sentinel1Intersec] = useIntersectionObserver({ rootMargin: '0px', threshold: [0.0, 1.0] });
    const [sentinel2, sentinel2Intersec] = useIntersectionObserver({ rootMargin: '0px', threshold: [0.0, 1.0] });

    return (
        <Lightbox
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            parentElement={parentElement}
            isCloseButtonVisible={false}
            preventAutoClose={preventAutoClose}
            noWrapper={true}
        >
            <div
                role="dialog"
                className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, size }))}
                style={{ display: 'block' }}
                onClick={preventClick}
            >
                <div className={`${CLASSNAME}__wrapper`}>
                    <div
                        className={`${CLASSNAME}__header ${
                            sentinel1Intersec && sentinel1Intersec.intersectionRatio !== 1
                                ? CLASSNAME + '__header--has-divider'
                                : ''
                        }`}
                    >
                        {header}
                    </div>
                    <div className={`${CLASSNAME}__content`}>
                        <div className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--top`} ref={sentinel1} />

                        <div>{children}</div>

                        {isLoading && (
                            <div className={`${CLASSNAME}__progress-overlay`}>
                                <Progress variant={ProgressVariant.circular} />
                            </div>
                        )}

                        <div className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--bottom`} ref={sentinel2} />
                    </div>
                    <div
                        className={`${CLASSNAME}__footer ${
                            sentinel2Intersec && sentinel2Intersec.intersectionRatio !== 1
                                ? CLASSNAME + '__footer--has-divider'
                                : ''
                        }`}
                    >
                        {footer}
                    </div>
                </div>
            </div>
        </Lightbox>
    );
};
Dialog.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Dialog, DialogProps, DialogSizes };
