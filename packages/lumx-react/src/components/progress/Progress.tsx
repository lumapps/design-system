import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, ValueOf } from '@lumx/react/utils';

/**
 * Progress variants.
 */
export const ProgressVariant = { linear: 'linear', circular: 'circular' } as const;
export type ProgressVariant = ValueOf<typeof ProgressVariant>;

/**
 * Defines the props of the component.
 */
export interface ProgressProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Progress variant. */
    variant?: ProgressVariant;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Progress';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressProps> = {
    theme: Theme.light,
    variant: ProgressVariant.circular,
};
/**
 * Progress component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Progress: Comp<ProgressProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, theme, variant, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, variant }))}
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
});
Progress.displayName = COMPONENT_NAME;
Progress.className = CLASSNAME;
Progress.defaultProps = DEFAULT_PROPS;
