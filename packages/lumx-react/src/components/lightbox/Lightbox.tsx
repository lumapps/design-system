import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { createPortal } from 'react-dom';

import { mdiClose } from '@lumx/icons';
import { ColorPalette, Emphasis, IconButton, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';

const _TRANSITION_DURATION = 400;

/**
 * Defines the props of the component.
 */
export interface LightboxProps extends GenericProps {
    /** The label for accessibility assistive devices. */
    ariaLabel?: string;
    /** Whether the closing button should be visible or not. */
    isCloseButtonVisible?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** The reference of the element that triggered modal opening to set focus on. */
    parentElement: RefObject<any>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The z-axis position. */
    zIndex?: number;
    /** The function called on close. */
    onClose?(): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Lightbox`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<LightboxProps> = {
    ariaLabel: 'Lightbox',
    isCloseButtonVisible: true,
    theme: Theme.light,
};

/**
 * Displays content within a modal.
 *
 * @return Lightbox.
 */
export const Lightbox: Comp<LightboxProps> = ({
    ariaLabel,
    children,
    className,
    isCloseButtonVisible,
    isOpen,
    onClose,
    parentElement,
    preventAutoClose,
    theme,
    zIndex,
    ...forwardedProps
}) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const buttonRef: React.RefObject<HTMLButtonElement> = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const childrenRef: React.RefObject<any> = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isTrapActive, setTrapActive] = useState(false);
    const modalElement: Element | null = document.querySelector(`.${CLASSNAME}`);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!isOpen || !modalElement) {
            return undefined;
        }
        disableBodyScroll(modalElement);
        return () => enableBodyScroll(modalElement);
    }, [isOpen, modalElement]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleClose = useCallback(
        (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (preventAutoClose) {
                return;
            }
            evt.stopPropagation();
            if (isFunction(onClose)) {
                onClose();
            }
        },
        [onClose, preventAutoClose],
    );

    /**
     * Prevent click bubbling to parent.
     *
     * @param evt Click event.
     */
    const preventClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation();
    };

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
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <div
                            {...forwardedProps}
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
Lightbox.className = CLASSNAME;
Lightbox.defaultProps = DEFAULT_PROPS;
