import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Theme } from 'LumX/components/index';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * Authorized variants.
 */
enum ProgressVariant {
    linear = 'linear',
    circular = 'circular',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProgressProps extends IGenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
    /* Type of progress */
    variant?: ProgressVariant;
}
type ProgressProps = IProgressProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ProgressProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Progress`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Theme.light,
    variant: ProgressVariant.circular,
};
/////////////////////////////

/**
 * Simple Progress component that can be displayed as a linear or circular element
 *
 * @return The component.
 */
const Progress: React.FC<ProgressProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    variant = DEFAULT_PROPS.variant,
    ...props
}: ProgressProps): ReactElement => {
    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, variant }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
            {...props}
        >
            <div className={classNames(`${CLASSNAME}-${variant}`)}>
                {variant === ProgressVariant.circular && (
                    <>
                        <div className="lumx-progress-circular__double-bounce1" />
                        <div className="lumx-progress-circular__double-bounce2" />

                        <svg className="lumx-progress-circular__svg" viewBox="25 25 50 50">
                            <circle
                                className="lumx-progress-circular__path"
                                cx="50"
                                cy="50"
                                r="20"
                                fill="none"
                                strokeWidth="5"
                            />
                        </svg>
                    </>
                )}
                {variant === ProgressVariant.linear && (
                    <>
                        <div className="lumx-progress-linear__line1" />
                        <div className="lumx-progress-linear__line2" />
                    </>
                )}
            </div>
        </div>
    );
};
Progress.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Progress, ProgressProps, ProgressVariant };
