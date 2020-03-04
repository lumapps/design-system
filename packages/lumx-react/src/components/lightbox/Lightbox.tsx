import React, { ReactElement, RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { createPortal } from 'react-dom';

import { mdiClose } from '@lumx/icons';
import { ColorPalette, Emphasis, IconButton, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

/////////////////////////////

const _TRANSITION_DURATION = 400;

/**
 * Defines the props of the component.
 */
interface LightboxProps extends GenericProps {
    /** Label for accessibility assistive devices. */
    ariaLabel?: string;
    /** should the close button be visible - default true */
    isCloseButtonVisible?: boolean;
    /** Status of lightbox. */
    isOpen?: boolean;
    /** Ref of element that triggered modal opening to set focus on. */
    parentElement: RefObject<any>;
    /** Prevent clickaway and escape to dismiss the lightbox */
    preventAutoClose?: boolean;
    /** Indicates if a wrapper that will block clickaway */
    noWrapper?: boolean;
    /**
     * ARIA role attribute to provide more information about the structure of a document for users
     *  of assistive technologies.
     */
    role?: string;
    /** Theme. */
    theme?: Theme;
    /** The z-axis position. */
    zIndex?: number;
    /** Callback called when lightbox is closing. */
    onClose?(): void;
    /** Callback called when lightbox is opening. */
    onOpen?(): void;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<LightboxProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    ariaLabel: 'Lightbox',
    isCloseButtonVisible: true,
    isOpen: false,
    noWrapper: false,
    onClose: noop,
    onOpen: noop,
    preventAutoClose: false,
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
    noWrapper = DEFAULT_PROPS.noWrapper,
    onClose = DEFAULT_PROPS.onClose,
    onOpen = DEFAULT_PROPS.onOpen,
    parentElement,
    preventAutoClose = DEFAULT_PROPS.preventAutoClose,
    role = DEFAULT_PROPS.role,
    theme = DEFAULT_PROPS.theme,
    zIndex,
}: LightboxProps): ReactElement => {
    const buttonRef: React.RefObject<HTMLButtonElement> = useRef(null);
    const childrenRef: React.RefObject<any> = useRef(null);
    const [isTrapActive, setTrapActive] = useState(false);
    const modalElement: Element | null = document.querySelector(`.${CLASSNAME}`);

    useEffect(() => {
        if (!isOpen || !modalElement) {
            return;
        }
        disableBodyScroll(modalElement);
        return () => enableBodyScroll(modalElement);
    }, [isOpen, modalElement]);

    useEffect(() => {
        if (isOpen) {
            setTrapActive(true);
        } else {
            setTimeout(() => {
                setTrapActive(false);
            }, _TRANSITION_DURATION);
        }
    }, [isOpen]);

    /**
     * Callback on activation of focus trap.
     */
    const handleFocusActivation = () => {
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
    const handleFocusDeactivation = () => {
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
        if (Boolean(preventAutoClose)) {
            return;
        }
        evt.stopPropagation();
        if (isFunction(onClose)) {
            onClose();
        }
    }, []);

    /**
     * Prevent click bubbling to parent.
     *
     * @param evt Click event.
     */
    const preventClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation();
    };

    /**
     * Wrap children, if needed, in an almost fullscreen div
     */
    const childrenWrapper = noWrapper ? (
        children
    ) : (
        <div ref={childrenRef} className={`${CLASSNAME}__wrapper`} role="presentation" onClick={preventClick}>
            {children}
        </div>
    );

    return (
        <>
            {isTrapActive &&
                createPortal(
                    <FocusTrap
                        active={isTrapActive}
                        focusTrapOptions={{
                            clickOutsideDeactivates: !preventAutoClose,
                            escapeDeactivates: !preventAutoClose,
                            fallbackFocus: `.${CLASSNAME}`,
                            onActivate: handleFocusActivation,
                            onDeactivate: handleFocusDeactivation,
                            returnFocusOnDeactivate: true,
                        }}
                    >
                        <div
                            aria-label={ariaLabel}
                            aria-modal="true"
                            className={classNames(
                                className,
                                handleBasicClasses({
                                    hidden: !isOpen,
                                    prefix: CLASSNAME,
                                    theme,
                                }),
                            )}
                            role={role}
                            style={{
                                display: isTrapActive ? 'block' : '',
                                zIndex,
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
                            {childrenWrapper}
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
