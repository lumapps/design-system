/* eslint-disable react/no-unknown-property */
import type { CommonRef, GenericProps, HasClassName, HasTheme, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';

/**
 * Progress sizes.
 */
export type ProgressCircularSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ProgressCircularProps extends HasTheme, HasClassName {
    /**
     * Progress circular size.
     */
    size?: ProgressCircularSize;
    /**
     * Progress display type (inline or block).
     * @default 'block'
     */
    display?: 'inline' | 'block';
    /** Component ref */
    ref?: CommonRef;
    /** additional props for the svg */
    svgProps?: GenericProps;
    /** additional props for the circle */
    circleProps?: GenericProps;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ProgressCircular';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-progress-circular';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ProgressCircularProps> = {
    size: Size.m,
    display: 'block',
};

/**
 * ProgressCircular component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ProgressCircular = (props: ProgressCircularProps) => {
    const {
        className,
        theme,
        size = DEFAULT_PROPS.size,
        display = DEFAULT_PROPS.display,
        ref,
        circleProps,
        svgProps,
        ...forwardedProps
    } = props;
    const Element = display === 'block' ? 'div' : 'span';

    return (
        <Element
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    [`size-${size}`]: Boolean(size),
                    [`display-${display}`]: Boolean(display),
                }),
            )}
        >
            <Element className={element('double-bounce1')} />
            <Element className={element('double-bounce2')} />

            <svg {...svgProps} viewBox="25 25 50 50">
                <circle {...circleProps} cx="50" cy="50" r="20" fill="none" />
            </svg>
        </Element>
    );
};
