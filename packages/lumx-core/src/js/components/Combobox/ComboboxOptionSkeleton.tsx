import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ListItem } from '../List/ListItem';
import { SkeletonTypography } from '../Skeleton/SkeletonTypography';

/**
 * Defines the props for the core ComboboxOptionSkeleton template.
 */
export interface ComboboxOptionSkeletonProps extends HasClassName {
    /** Content rendered before the skeleton text (e.g. SkeletonCircle for avatar placeholders). */
    before?: JSXElement;
    /** Content rendered after the skeleton text. */
    after?: JSXElement;
    /** Show a secondary skeleton line (mirrors ComboboxOption's `description` prop). */
    hasDescription?: boolean;
    /** Override the default SkeletonTypography content entirely. */
    children?: JSXElement;
    /** ref to the root <li> element. */
    ref?: CommonRef;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 * Used by `ReactToJSX<ComboboxOptionSkeletonProps, ComboboxOptionSkeletonPropsToOverride>`.
 */
export type ComboboxOptionSkeletonPropsToOverride = 'before' | 'after' | 'children';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ComboboxOptionSkeleton';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-combobox-option-skeleton';

/**
 * ComboboxOptionSkeleton core template.
 * Renders a skeleton placeholder `<li>` inside a combobox list, styled to match
 * option dimensions. Uses `role="none"` so screen readers ignore it.
 *
 * Width variation across sibling skeletons is handled by SCSS `:nth-child` rules,
 * not by props — the component itself does not need a `width` prop.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ComboboxOptionSkeleton = (props: ComboboxOptionSkeletonProps) => {
    const { hasDescription, children, className, ref, ...forwardedProps } = props;

    return ListItem({
        ref,
        size: 'tiny',
        role: 'none',
        ...forwardedProps,
        className: classNames.join(className, CLASSNAME),
        children: children || (
            <>
                <SkeletonTypography typography="body1" theme="light" />
                {hasDescription && <SkeletonTypography typography="caption" theme="light" />}
            </>
        ),
    } as any);
};
