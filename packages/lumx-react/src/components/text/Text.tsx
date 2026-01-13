import { ColorWithVariants, ColorVariant, Typography, WhiteSpace } from '@lumx/react';
import { GenericProps, TextElement } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { useOverflowTooltipLabel } from '@lumx/react/hooks/useOverflowTooltipLabel';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';

/**
 * Defines the props of the component.
 */
export interface TextProps extends GenericProps {
    /**
     * Color variant.
     */
    color?: ColorWithVariants;
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
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Text';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-text';

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

    const { block } = useClassnames(CLASSNAME);

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

    const { tooltipLabel, labelRef } = useOverflowTooltipLabel(children);

    return (
        <Component
            ref={useMergeRefs(ref as React.Ref<any>, labelRef)}
            className={block(
                {
                    'is-truncated': isTruncated && !isTruncatedMultiline,
                    'is-truncated-multiline': isTruncatedMultiline,
                    'no-wrap': noWrap,
                },
                [
                    typography && classNames.typography(typography),
                    color && classNames.font(color, colorVariant),
                    className,
                ],
            )}
            title={tooltipLabel}
            style={{ ...truncateLinesStyle, ...whiteSpaceStyle, ...style }}
            {...forwardedProps}
        >
            {wrapChildrenIconWithSpaces(children)}
        </Component>
    );
});
Text.displayName = COMPONENT_NAME;
Text.className = CLASSNAME;
Text.defaultProps = DEFAULT_PROPS;
