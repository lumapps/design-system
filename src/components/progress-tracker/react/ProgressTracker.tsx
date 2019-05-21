import React from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProgressTrackerProps extends IGenericProps {}
type ProgressTrackerProps = IProgressTrackerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ProgressTrackerProps> {
    /** The active step index. */
    activeStep: number;
    /** The current component theme. */
    theme?: Theme;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}ProgressTracker`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    activeStep: 0,
    theme: Themes.light,
};

/////////////////////////////

/**
 * Displays a track of steps.
 *
 * Each step can have multiple attributes defining their current state to keep the user
 * aware of it's position in the process.
 *
 * @return {React.ReactElement} The component.
 */
const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    activeStep = DEFAULT_PROPS.activeStep,
    children,
    className = '',
    theme = DEFAULT_PROPS.theme,
    ...props
}: ProgressTrackerProps): React.ReactElement => {
    const backgroundPosition: number = 100 / (children.length * 2);
    const trackPosition: number = ((100 / (children.length - 1)) * activeStep) / 100;

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
            <div className="lumx-progress-tracker__steps" ng-transclude>
                {children}
            </div>

            <div
                className="lumx-progress-tracker__background-bar"
                style={{ left: `${backgroundPosition}%`, right: `${backgroundPosition}%` }}
            />

            <div
                className="lumx-progress-tracker__foreground-bar"
                style={{
                    left: `${backgroundPosition}%`,
                    right: `${backgroundPosition}%`,
                    transform: `scaleX(${trackPosition} )`,
                }}
            />
        </div>
    );
};
ProgressTracker.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, ProgressTracker, ProgressTrackerProps };
