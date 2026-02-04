import castArray from 'lodash/castArray';

import { Orientation } from '../../constants';
import { classNames } from '../../utils';
import type { GenericProps, LumxClassName, JSXElement } from '../../types';
import type { FlexHorizontalAlignment, FlexVerticalAlignment, GapSize, MarginAutoAlignment } from './types';

export type * from './types';

/**
 * Defines the props of the component.
 */
export interface FlexBoxProps extends GenericProps {
    /** Children elements. */
    children?: JSXElement;
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
export const COMPONENT_NAME = 'FlexBox';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-flex-box';
export const { block } = classNames.bem(CLASSNAME);

/**
 * Get FlexBox component props (className computation).
 *
 * @param  props Component props.
 * @return Computed props with className.
 */
export function getFlexBoxProps(props: FlexBoxProps) {
    const { className, fillSpace, gap, hAlign, marginAuto, noShrink, vAlign, wrap, orientation, ...forwardedProps } =
        props;

    const adjustedOrientation = orientation ?? (wrap || hAlign || vAlign ? Orientation.horizontal : null);

    return {
        ...forwardedProps,
        className: classNames.join(
            className,
            block({
                [`orientation-${adjustedOrientation}`]: Boolean(adjustedOrientation),
                [`v-align-${vAlign}`]: Boolean(vAlign),
                [`h-align-${hAlign}`]: Boolean(hAlign),
                [`gap-${gap}`]: Boolean(gap),
                wrap: Boolean(wrap),
                'fill-space': fillSpace,
                'no-shrink': noShrink,
                ...Object.fromEntries(
                    castArray(marginAuto)
                        .filter(Boolean)
                        .map((align) => [`margin-auto-${align}`, true]),
                ),
            }),
        ),
    };
}
