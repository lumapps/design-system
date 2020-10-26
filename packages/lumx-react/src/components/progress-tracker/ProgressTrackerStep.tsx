import React from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Icon, InputHelper, InputLabel, Kind, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from '@lumx/icons';

/**
 * Defines the props of the component.
 */
interface ProgressTrackerStepProps extends GenericProps {
    /** Whether the step should be in error state or not. */
    hasError?: boolean;

    /** The step's helper text. */
    helper?: string | null;

    /** Whether the current step is active. */
    isActive?: boolean;

    /** Whether the current step is completed. */
    isComplete?: boolean;

    /** The step's label. */
    label?: string | null;

    /** The component theme to apply. */
    theme?: Theme;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ProgressTrackerStepProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ProgressTrackerStep`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerStepProps> = {
    theme: Theme.light,
};

/**
 * Defines a step for the `ProgressTracker` element.
 *
 * @return The component.
 */
const ProgressTrackerStep: React.FC<ProgressTrackerStepProps> = ({
    className,
    hasError,
    helper,
    isActive,
    isComplete,
    label,
    theme,
    ...props
}) => {
    const { onClick = null, ...forwardedProps } = props;

    const isClickable: boolean = isFunction(onClick);

    /**
     * Provides correct icon depending on step's current status.
     *
     * @return The correct svg path.
     */
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
        <a
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    active: isActive,
                    clickable: isClickable,
                    complete: isComplete,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CLASSNAME}--has-error`]: hasError },
            )}
            tabIndex={isClickable ? 0 : -1}
            onClick={onClick}
            onKeyDown={onEnterPressed(onClick)}
        >
            <Icon className={`${CLASSNAME}__state`} icon={getIcon()} size={Size.s} />

            <InputLabel theme={theme} className={`${CLASSNAME}__label`}>
                {label}
            </InputLabel>

            {helper && (
                <InputHelper kind={hasError ? Kind.error : Kind.info} theme={theme} className={`${CLASSNAME}__helper`}>
                    {helper}
                </InputHelper>
            )}
        </a>
    );
};

ProgressTrackerStep.displayName = COMPONENT_NAME;
ProgressTrackerStep.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, ProgressTrackerStep, ProgressTrackerStepProps };
