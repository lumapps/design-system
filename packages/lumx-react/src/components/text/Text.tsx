import React, { Children, Fragment, forwardRef } from 'react';

import { Icon, Color, ColorVariant, Typography } from '@lumx/react';
import { Comp, GenericProps, HeadingElement, isComponent } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import classNames from 'classnames';

type TextComponents = 'span' | 'p' | HeadingElement;

/**
 * Defines the props of the component.
 */
export interface TextProps extends GenericProps {
    /**
     * Color variant.
     */
    color?: Color;
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
    as: TextComponents;
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
        as,
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

    const Component = as as TextComponents;
    const colorClass = color && `lumx-color-font-${color}-${colorVariant || ColorVariant.N}`;
    const typographyClass = typography && `lumx-typography-${typography}`;

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
