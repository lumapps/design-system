import React, { Children, Fragment } from 'react';

import classNames from 'classnames';

import { Icon, ColorPalette, ColorVariant, Typography, WhiteSpace } from '@lumx/react';
import { type GenericProps, type TextElement, isComponentType, type ComponentClassName } from '@lumx/react/utils/type';
import { getFontColorClassName, handleBasicClasses, getTypographyClassName } from '@lumx/react/utils/className';
import { useOverflowTooltipLabel } from '@lumx/react/hooks/useOverflowTooltipLabel';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
    /**
     * WhiteSpace variant
     * Ignored when `noWrap` is set to true
     * Ignored when `truncate` is set to true or lines: 1
     * */
    whiteSpace?: WhiteSpace;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Text';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-text';

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
export const Text = forwardRef<TextProps>((props, ref) => {
    const {
        as: Component,
        children,
        className,
        color,
        colorVariant,
        noWrap,
        typography,
        truncate,
        whiteSpace,
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

    /**
     * Add custom white-space style if specified
     * Disabled if noWrap is specified
     * Disabled if truncated on one-line
     * */
    const whiteSpaceStyle = !noWrap &&
        !(isTruncated && !isTruncatedMultiline) &&
        whiteSpace && { '--lumx-text-white-space': whiteSpace };

    const { tooltipLabel, labelRef } = useOverflowTooltipLabel();

    return (
        <Component
            ref={useMergeRefs(ref as React.Ref<any>, labelRef)}
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
            title={tooltipLabel}
            style={{ ...truncateLinesStyle, ...whiteSpaceStyle, ...style }}
            {...forwardedProps}
        >
            {children &&
                Children.toArray(children).map((child, index) => {
                    // Force wrap spaces around icons to make sure they are never stuck against text.
                    if (isComponentType(Icon)(child)) {
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
