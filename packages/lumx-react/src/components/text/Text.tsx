import React, { forwardRef } from 'react';

import { Color, ColorVariant, Typography } from '@lumx/react';
import { Comp, GenericProps, HeadingElement } from '@lumx/react/utils/type';
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
    const { as, children, className, color, colorVariant, typography, truncate, style, ...forwardedProps } = props;

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
            )}
            style={{ ...truncateLinesStyle, ...style }}
            {...forwardedProps}
        >
            {children}
        </Component>
    );
});
Text.displayName = COMPONENT_NAME;
Text.className = CLASSNAME;
Text.defaultProps = DEFAULT_PROPS;
