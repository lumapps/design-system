import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized variants.
 */
enum ProgressVariant {
    linear = 'linear',
    circular = 'circular',
}

/**
 * Defines the props of the component.
 */
interface ProgressProps extends GenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The component variant. */
    variant?: ValueOf<ProgressVariant>;
}

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
const DEFAULT_PROPS: Partial<ProgressProps> = {
    theme: Theme.light,
    variant: ProgressVariant.circular,
};

const Progress: React.FC<ProgressProps> = ({ className, theme, useCustomColors, variant, ...forwardedProps }) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, variant }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
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
Progress.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Progress, ProgressProps, ProgressVariant };
