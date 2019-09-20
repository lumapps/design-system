import React, { ReactElement, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { createPortal } from 'react-dom';

import { ColorPalette, Emphasis, IconButton, Theme } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { mdiClose } from 'LumX/icons';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ILightboxProps extends IGenericProps {
    /** Label for accessibility assistive devices. */
    ariaLabel?: string;
    /** should the close button be visible - default true */
    isCloseButtonVisible?: boolean;
    /** Status of lightbox. */
    isOpen?: boolean;
    /** Ref of element that triggered modal opening to set focus on. */
    // tslint:disable-next-line: no-any
    parentElement: RefObject<any>;
    /**
     * ARIA role attribute to provide more information about the structure of a document for users
     *  of assistive technologies.
     */
    role?: string;
    /** Theme. */
    theme?: Theme;
    /** Callback called when lightbox is closing. */
    onClose?(): void;
    /** Callback called when lightbox is opening. */
    onOpen?(): void;
}
type LightboxProps = ILightboxProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<LightboxProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Lightbox`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    ariaLabel: 'Lightbox',
    isCloseButtonVisible: true,
    isOpen: false,
    onClose: noop,
    onOpen: noop,
    role: 'dialog',
    theme: Theme.light,
};
/////////////////////////////

/**
 * Displays content within a modal.
 *
 * @return Lightbox.
 */
const Lightbox: React.FC<LightboxProps> = ({
    ariaLabel = DEFAULT_PROPS.ariaLabel,
    children,
    className = '',
    isCloseButtonVisible = DEFAULT_PROPS.isCloseButtonVisible,
    isOpen = DEFAULT_PROPS.isOpen,
    onClose = DEFAULT_PROPS.onClose,
    onOpen = DEFAULT_PROPS.onOpen,
    parentElement,
    role = DEFAULT_PROPS.role,
    theme = DEFAULT_PROPS.theme,
}: LightboxProps): ReactElement => {
    // tslint:disable-next-line: no-any
    const buttonRef: React.RefObject<any> = useRef(null);
    // tslint:disable-next-line: no-any
    const childrenRef: React.RefObject<any> = useRef(null);
    const [isTrapActive, setTrapActive] = useState(false);
    const modalElement: Element | null = document.querySelector(`.${CLASSNAME}`);

    useEffect(() => {
        // After mount.
        setTrapActive(isOpen && children);

        if (isOpen) {
            disableBodyScroll(modalElement);
        }

        // Before unmount.
        return (): void => {
            enableBodyScroll(modalElement);
        };
    }, [isOpen, children, modalElement, parentElement]);

    /**
     * Callback on activation of focus trap.
     */
    const handleFocusActivation = (): void => {
        if (childrenRef && childrenRef.current && childrenRef.current.firstChild) {
            // Set focus inside lightbox.
            childrenRef.current.firstChild.focus();
        }

        if (isFunction(onOpen)) {
            onOpen();
        }
    };

    /**
     * Callback on deactivation of focus trap.
     */
    const handleFocusDeactivation = (): void => {
        if (parentElement && parentElement.current) {
            // Set focus back on parent element.
            parentElement.current.focus();
        }

        if (isFunction(onClose)) {
            onClose();
        }
    };

    /**
     * Desactivate trap and modal.
     *
     * @param evt Click event.
     */
    const handleClose = useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setTrapActive(false);
        evt.stopPropagation();
    }, []);

    /**
     * Prevent click bubbling to parent.
     *
     * @param evt Click event.
     */
    const preventClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        evt.stopPropagation();
    };

    return (
        <>
            {isTrapActive &&
                createPortal(
                    <FocusTrap
                        active={isTrapActive}
                        focusTrapOptions={{
                            clickOutsideDeactivates: true,
                            escapeDeactivates: true,
                            fallbackFocus: `.${CLASSNAME}`,
                            onActivate: handleFocusActivation,
                            onDeactivate: handleFocusDeactivation,
                            returnFocusOnDeactivate: true,
                        }}
                    >
                        <div
                            aria-label={ariaLabel}
                            aria-modal="true"
                            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
                            role={role}
                            style={{
                                display: isTrapActive ? 'block' : '',
                            }}
                            onClick={handleClose}
                        >
                            {isCloseButtonVisible && (
                                <IconButton
                                    aria-labelledby="close-modal"
                                    buttonRef={buttonRef}
                                    className={`${CLASSNAME}__close`}
                                    color={ColorPalette.light}
                                    emphasis={Emphasis.low}
                                    icon={mdiClose}
                                    theme={theme}
                                    type="button"
                                    onClick={handleClose}
                                />
                            )}
                            <div
                                ref={childrenRef}
                                className={`${CLASSNAME}__wrapper`}
                                role="presentation"
                                onClick={preventClick}
                            >
                                {children}
                            </div>
                        </div>
                    </FocusTrap>,
                    document.body,
                )}
        </>
    );
};
Lightbox.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Lightbox, LightboxProps };
