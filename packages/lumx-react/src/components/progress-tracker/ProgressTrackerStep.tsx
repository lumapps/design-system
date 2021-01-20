import React, { FocusEventHandler, forwardRef, KeyboardEventHandler, useCallback } from 'react';

import classNames from 'classnames';

import { Icon, InputHelper, InputLabel, Kind, Size } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from '@lumx/icons';
import { useTabProviderContext } from '../tabs/state';

/**
 * Defines the props of the component.
 */
export interface ProgressTrackerStepProps extends GenericProps {
    /** Children are not supported. */
    children?: never;
    /** Whether the step should be in error state or not. */
    hasError?: boolean;
    /** Helper text. */
    helper?: string | null;
    /** Native id property. */
    id?: string;
    /** Whether the current step is active or not. */
    isActive?: boolean;
    /** Whether the current step is completed or not. */
    isComplete?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label text. */
    label?: string | null;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressTrackerStep';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerStepProps> = {};

/**
 * ProgressTrackerStep component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressTrackerStep: Comp<ProgressTrackerStepProps, HTMLButtonElement> = forwardRef((props, ref) => {
    const {
        className,
        disabled,
        hasError,
        helper,
        id,
        isActive: propIsActive,
        isComplete,
        isDisabled = disabled,
        label,
        onFocus,
        onKeyPress,
        tabIndex = -1,
        ...forwardedProps
    } = props;
    const state = useTabProviderContext('tab', id);
    const isActive = propIsActive || state?.isActive;

    const changeToCurrentTab = useCallback(() => {
        if (isDisabled) {
            return;
        }
        state?.changeToTab();
    }, [isDisabled, state]);

    const handleFocus: FocusEventHandler = useCallback(
        (event) => {
            onFocus?.(event);
            if (state?.shouldActivateOnFocus) {
                changeToCurrentTab();
            }
        },
        [changeToCurrentTab, onFocus, state?.shouldActivateOnFocus],
    );

    const handleKeyPress: KeyboardEventHandler = useCallback(
        (event) => {
            onKeyPress?.(event);
            if (event.key !== 'Enter') {
                return;
            }
            changeToCurrentTab();
        },
        [changeToCurrentTab, onKeyPress],
    );

    const getIcon = (): string => {
        if (isComplete) {
            return mdiCheckCircle;
        }

        if (isActive) {
            return hasError ? mdiAlertCircle : mdiRadioboxMarked;
        }

        return mdiRadioboxBlank;
    };

    return (
        <button
            ref={ref}
            {...forwardedProps}
            type="button"
            id={state?.tabId}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    hasError,
                    isActive,
                    isClickable: state && !isDisabled,
                    isComplete,
                }),
            )}
            onClick={changeToCurrentTab}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            role="tab"
            tabIndex={isActive ? 0 : tabIndex}
            aria-disabled={isDisabled}
            aria-selected={isActive}
            aria-controls={state?.tabPanelId}
        >
            <Icon className={`${CLASSNAME}__state`} icon={getIcon()} size={Size.s} />

            <InputLabel htmlFor={state?.tabId || ''} className={`${CLASSNAME}__label`}>
                {label}
            </InputLabel>

            {helper && (
                <InputHelper kind={hasError ? Kind.error : Kind.info} className={`${CLASSNAME}__helper`}>
                    {helper}
                </InputHelper>
            )}
        </button>
    );
});
ProgressTrackerStep.displayName = COMPONENT_NAME;
ProgressTrackerStep.className = CLASSNAME;
ProgressTrackerStep.defaultProps = DEFAULT_PROPS;
