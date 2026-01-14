import { classNames } from '../../utils';
import type { GenericProps, TextElement, LumxClassName, JSXElement } from '../../types';
import { ColorWithVariants, ColorVariant, Typography, WhiteSpace } from '../../constants';

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
    children?: JSXElement;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Text';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-text';
export const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {} as const;

/**
 * Text component common props
 *
 * @param  props Component props.
 * @return Common Props
 */
export const getTextProps = (props: TextProps) => {
    const { className, color, colorVariant, noWrap, typography, truncate, whiteSpace, style } = props;

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

    return {
        className: classNames.join(
            className,
            block({
                'is-truncated': isTruncated && !isTruncatedMultiline,
                'is-truncated-multiline': isTruncatedMultiline,
                'no-wrap': noWrap,
            }),
            typography && classNames.typography(typography),
            color && classNames.font(color, colorVariant),
        ),
        style: { ...truncateLinesStyle, ...whiteSpaceStyle, ...style },
    };
};
