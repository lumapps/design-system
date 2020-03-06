import React, { Children } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ProgressTrackerProps extends GenericProps {
    /** The active step index. */
    activeStep?: number;
    /** The current component theme. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ProgressTracker`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<ProgressTrackerProps> = {
    activeStep: 0,
    theme: Theme.light,
};

/**
 * Displays a track of steps.
 *
 * Each step can have multiple attributes defining their current state to keep the user
 * aware of it's position in the process.
 *
 * @return The component.
 */
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    activeStep = DEFAULT_PROPS.activeStep,
    children,
    className,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => {
    const childrenArray = Children.toArray(children);
    const backgroundPosition: number = childrenArray.length > 0 ? 100 / (childrenArray.length * 2) : 0;
    const trackPosition: number =
        childrenArray.length > 0 ? ((100 / (childrenArray.length - 1)) * (activeStep as number)) / 100 : 0;

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
            <div className={`${CLASSNAME}__steps`}>{children}</div>

            <div
                className={`${CLASSNAME}__background-bar`}
                style={{ left: `${backgroundPosition}%`, right: `${backgroundPosition}%` }}
            />

            <div
                className={`${CLASSNAME}__foreground-bar`}
                style={{
                    left: `${backgroundPosition}%`,
                    right: `${backgroundPosition}%`,
                    transform: `scaleX(${trackPosition})`,
                }}
            />
        </div>
    );
};
ProgressTracker.displayName = COMPONENT_NAME;
