import React, { Children } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ProgressTrackerProps extends GenericProps {
    /** The active step index. */
    activeStep: number;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ProgressTracker`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerProps> = {
    activeStep: 0,
    theme: Theme.light,
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    activeStep = DEFAULT_PROPS.activeStep as number,
    children,
    className,
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => {
    const childrenArray = Children.toArray(children);
    const backgroundPosition: number = childrenArray.length > 0 ? 100 / (childrenArray.length * 2) : 0;
    const trackPosition: number =
        childrenArray.length > 0 ? ((100 / (childrenArray.length - 1)) * activeStep) / 100 : 0;

    return (
        <div {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}>
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

export { CLASSNAME, DEFAULT_PROPS, ProgressTracker, ProgressTrackerProps };
