import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * Authorized variants.
 */
const enum Variants {
    linear = 'linear',
    circular = 'circular',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProgressProps extends IGenericProps {
    /* Type of progress */
    variant?: Variant;
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
    variant: Variants.circular,
};
/////////////////////////////

/**
 * Simple Progress component that can be displayed as a linear or circular element
 *
 * @return The component.
 */
const Progress: React.FC<ProgressProps> = ({
    className = '',
    variant = DEFAULT_PROPS.variant,
    ...props
}: ProgressProps): ReactElement => {
    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), `${CLASSNAME}--${variant}`)}
            {...props}
        >
            <div className={classNames(`${CLASSNAME}-${variant}`)}>
                {variant === Variants.circular && (
                    <>
                        <div className="lumx-progress-circular__double-bounce1" />
                        <div className="lumx-progress-circular__double-bounce2" />
                    </>
                )}
                {variant === Variants.linear && (
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

export { CLASSNAME, DEFAULT_PROPS, Progress, ProgressProps, Variants };
