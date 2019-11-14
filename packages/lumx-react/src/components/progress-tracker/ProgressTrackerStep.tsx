import React, { ReactElement } from 'react';

import classNames from 'classnames';

import isFunction from 'lodash/isFunction';

import { Icon, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/react/utils';
import { handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import { mdiAlertCircle, mdiCheckCircle, mdiRadioboxBlank, mdiRadioboxMarked } from '@lumx/icons';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProgressTrackerStepProps extends IGenericProps {}
type ProgressTrackerStepProps = IProgressTrackerStepProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ProgressTrackerStepProps> {
    /** Whether the step should be in error state or not. */
    hasError?: boolean;

    /** The step's helper text. */
    helper?: string | null;

    /** Whether the current step is active. */
    isActive: boolean;

    /** Whether the current step is completed. */
    isComplete: boolean;

    /** The step's label. */
    label: string | null;

    /** The component theme to apply. */
    theme?: Theme;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    hasError: false,
    helper: null,
    isActive: false,
    isComplete: false,
    label: null,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Defines a step for the `ProgressTracker` element.
 *
 * @return The component.
 */
const ProgressTrackerStep: React.FC<ProgressTrackerStepProps> = ({
    className = '',
    hasError = DEFAULT_PROPS.hasError,
    helper = DEFAULT_PROPS.helper,
    isActive = DEFAULT_PROPS.isActive,
    isComplete = DEFAULT_PROPS.isComplete,
    label = DEFAULT_PROPS.label,
    theme = DEFAULT_PROPS.theme,
    ...props
}: ProgressTrackerStepProps): ReactElement => {
    const { onClick = null, ...restProps }: IProgressTrackerStepProps = props;

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
            {...restProps}
        >
            <Icon className={`${CLASSNAME}__state`} icon={getIcon()} size={Size.s} />

            <span className={`${CLASSNAME}__label`}>{label}</span>

            {helper && <span className={`${CLASSNAME}__helper`}>{helper}</span>}
        </a>
    );
};

ProgressTrackerStep.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ProgressTrackerStep, ProgressTrackerStepProps };
