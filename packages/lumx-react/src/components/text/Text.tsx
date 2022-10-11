import React, { Children, Fragment, forwardRef } from 'react';

import { Icon, ColorPalette, ColorVariant, Typography } from '@lumx/react';
import { Comp, GenericProps, TextElement, isComponent } from '@lumx/react/utils/type';
import {
    getFontColorClassName,
    getRootClassName,
    handleBasicClasses,
    getTypographyClassName,
} from '@lumx/react/utils/className';
import classNames from 'classnames';

/**
 * Defines the props of the component.
 */
export interface TextProps extends GenericProps {
    /**
     * Color variant.
     */
    color?: ColorPalette;
    /**
     * Lightened or darkened variant of the selected color.
     */
    colorVariant?: ColorVariant;
    /**
     * Typography variant.
     */
    typography?: Typography;
    /**
     * Custom component to render the text.
     */
    as: TextElement;
    /**
     * Control whether the text should truncate or not.
     * Setting as `true` will make the text truncate on a single line.
     * Setting as `{ lines: number }` will make the text truncate on a multiple lines.
     */
    truncate?: boolean | { lines: number };
    /**
     * Prevents text to wrap on multiple lines
     * (automatically activated when single line text truncate is activated).
     */
    noWrap?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Text';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS = {} as const;

/**
 * Text component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Text: Comp<TextProps> = forwardRef((props, ref) => {
    const {
        as: Component,
        children,
        className,
        color,
        colorVariant,
        noWrap,
        typography,
        truncate,
        style,
        ...forwardedProps
    } = props;

    const colorClass = color && getFontColorClassName(color, colorVariant);
    const typographyClass = typography && getTypographyClassName(typography);

    // Truncate mode
    const truncateLinesStyle = typeof truncate === 'object' &&
        truncate.lines > 1 && { '--lumx-text-truncate-lines': truncate.lines };
    const isTruncatedMultiline = !!truncateLinesStyle;
    const isTruncated = !!truncate;

    return (
        <Component
            ref={ref as React.Ref<any>}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    isTruncated: isTruncated && !isTruncatedMultiline,
                    isTruncatedMultiline,
                }),
                typographyClass,
                colorClass,
                noWrap && `${CLASSNAME}--no-wrap`,
            )}
            style={{ ...truncateLinesStyle, ...style }}
            {...forwardedProps}
        >
            {Children.toArray(children).map((child, index) => {
                // Force wrap spaces around icons to make sure they are never stuck against text.
                if (isComponent(Icon)(child)) {
                    return <Fragment key={child.key || index}> {child} </Fragment>;
                }
                return child;
            })}
        </Component>
    );
});
Text.displayName = COMPONENT_NAME;
Text.className = CLASSNAME;
Text.defaultProps = DEFAULT_PROPS;
