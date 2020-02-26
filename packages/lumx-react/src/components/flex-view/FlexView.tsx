import { Alignment, Orientation } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/react/utils';
import classNames from 'classnames';
import React from 'react';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IFlexViewProps extends IGenericProps {
    orientation?: Orientation;
    wrap?: string;
    vAlign?: Alignment;
    hAlign?: Alignment;
    fillSpace?: boolean;
    noShrink?: boolean;
    marginAuto?: Alignment;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}FlexView`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const FlexView: React.FC<IFlexViewProps> = ({
    children,
    className = '',
    orientation,
    wrap,
    vAlign,
    hAlign,
    fillSpace,
    noShrink,
    marginAuto,
    ...props
}: IFlexViewProps): React.ReactElement => (
    <div
        className={classNames(CLASSNAME, className, {
            [`${CLASSNAME}--orientation-${orientation}`]: orientation,
            [`${CLASSNAME}--v-align-${vAlign}`]: vAlign,
            [`${CLASSNAME}--h-align-${hAlign}`]: hAlign,
            [`${CLASSNAME}--wrap`]: wrap,
            [`${CLASSNAME}--fill-space`]: fillSpace,
            [`${CLASSNAME}--no-shrink`]: noShrink,
            [`${CLASSNAME}--margin-auto-${marginAuto}`]: marginAuto,
        })}
        {...props}
    >
        {children}
    </div>
);

FlexView.displayName = COMPONENT_NAME;

export { CLASSNAME, FlexView, IFlexViewProps };
