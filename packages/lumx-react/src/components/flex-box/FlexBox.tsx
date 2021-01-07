import { Alignment, HorizontalAlignment, Orientation, VerticalAlignment } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import castArray from 'lodash/castArray';
import React, { forwardRef, ReactNode } from 'react';
import { Size } from '..';

export type MarginAutoAlignment = Extract<Alignment, 'top' | 'bottom' | 'right' | 'left'>;
export type GapSize = Extract<Size, 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface FlexBoxProps extends GenericProps {
    /** Children elements. */
    children?: ReactNode;
    /** Whether the "content filling space" is enabled or not. */
    fillSpace?: boolean;
    /** Gap space between flexbox items. */
    gap?: GapSize;
    /** Flex horizontal alignment. */
    hAlign?: VerticalAlignment;
    /** Whether the "auto margin" is enabled all around or not. */
    marginAuto?: MarginAutoAlignment | MarginAutoAlignment[];
    /** Whether the "content shrink" is disabled or not. */
    noShrink?: boolean;
    /** Flex direction. */
    orientation?: Orientation;
    /** Flex vertical alignment. */
    vAlign?: HorizontalAlignment;
    /** Whether the "flex wrap" is enabled or not. */
    wrap?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'FlexBox';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * FlexBox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const FlexBox: Comp<FlexBoxProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        children,
        className,
        fillSpace,
        gap,
        hAlign,
        marginAuto,
        noShrink,
        orientation,
        vAlign,
        wrap,
        ...forwardedProps
    } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    orientation: orientation ?? (wrap || hAlign || vAlign ? Orientation.horizontal : null),
                    vAlign,
                    hAlign,
                    gap,
                }),
                wrap && `${CLASSNAME}--wrap`,
                fillSpace && `${CLASSNAME}--fill-space`,
                noShrink && `${CLASSNAME}--no-shrink`,
                marginAuto && castArray(marginAuto).map((align) => `${CLASSNAME}--margin-auto-${align}`),
            )}
        >
            {children}
        </div>
    );
});
FlexBox.displayName = COMPONENT_NAME;
FlexBox.className = CLASSNAME;
