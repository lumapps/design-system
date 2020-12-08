import React, { FocusEventHandler, KeyboardEventHandler, useCallback } from 'react';

import classNames from 'classnames';

import { Icon, InputHelper, InputLabel, Kind, Size } from '@lumx/react';

import { COMPONENT_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
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
    /** The helper of the step. */
    helper?: string | null;
    /** The step HTML id. */
    id?: string;
    /** Whether the current step is active or not. */
    isActive?: boolean;
    /** Whether the current step is completed or not. */
    isComplete?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The label of the step. */
    label?: string | null;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ProgressTrackerStep`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerStepProps> = {};

/**
 * ProgressTrackerStep component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @return React element.
 */
export const ProgressTrackerStep: Comp<ProgressTrackerStepProps> = (props) => {
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
            const keyCode = event.which ?? event.keyCode;
            if (keyCode !== ENTER_KEY_CODE) {
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

            <InputLabel className={`${CLASSNAME}__label`}>{label}</InputLabel>

            {helper && (
                <InputHelper kind={hasError ? Kind.error : Kind.info} className={`${CLASSNAME}__helper`}>
                    {helper}
                </InputHelper>
            )}
        </button>
    );
};

ProgressTrackerStep.displayName = COMPONENT_NAME;
ProgressTrackerStep.className = CLASSNAME;
ProgressTrackerStep.defaultProps = DEFAULT_PROPS;
