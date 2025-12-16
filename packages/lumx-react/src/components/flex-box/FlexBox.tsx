import { ReactNode } from 'react';

import classNames from 'classnames';
import castArray from 'lodash/castArray';

import { Alignment, Orientation, HorizontalAlignment, Size, VerticalAlignment } from '@lumx/core/js/constants';
import { GenericProps } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export type MarginAutoAlignment = Extract<Alignment, 'top' | 'bottom' | 'right' | 'left'>;
export type GapSize = Extract<Size, 'tiny' | 'regular' | 'medium' | 'big' | 'huge'>;
type SpaceAlignment = Extract<Alignment, 'space-between' | 'space-evenly' | 'space-around'>;
export type FlexVerticalAlignment = VerticalAlignment | SpaceAlignment;
export type FlexHorizontalAlignment = HorizontalAlignment | SpaceAlignment;

/**
 * Defines the props of the component.
 */
export interface FlexBoxProps extends GenericProps {
    /** Customize the root element. */
    as?: React.ElementType;
    /** Children elements. */
    children?: ReactNode;
    /** Whether the "content filling space" is enabled or not. */
    fillSpace?: boolean;
    /** Gap space between flexbox items. */
    gap?: GapSize;
    /** Flex horizontal alignment. */
    hAlign?: FlexVerticalAlignment;
    /** Whether the "auto margin" is enabled all around or not. */
    marginAuto?: MarginAutoAlignment | MarginAutoAlignment[];
    /** Whether the "content shrink" is disabled or not. */
    noShrink?: boolean;
    /** Flex direction. */
    orientation?: Orientation;
    /** Flex vertical alignment. */
    vAlign?: FlexHorizontalAlignment;
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-flex-box';

/**
 * FlexBox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const FlexBox = forwardRef<FlexBoxProps, HTMLDivElement>((props, ref) => {
    const {
        as: Component = 'div',
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
        <Component
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
        </Component>
    );
});
FlexBox.displayName = COMPONENT_NAME;
FlexBox.className = CLASSNAME;
