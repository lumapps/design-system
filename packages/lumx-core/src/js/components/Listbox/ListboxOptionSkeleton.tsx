import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ListItem } from '../List/ListItem';
import { SkeletonTypography } from '../Skeleton/SkeletonTypography';

/**
 * Defines the props for the core ListboxOptionSkeleton template.
 */
export interface ListboxOptionSkeletonProps extends HasClassName {
    /** Content rendered before the skeleton text (e.g. SkeletonCircle for avatar placeholders). */
    before?: JSXElement;
    /** Content rendered after the skeleton text. */
    after?: JSXElement;
    /** Show a secondary skeleton line (mirrors ListboxOption's `description` prop). */
    hasDescription?: boolean;
    /** Override the default SkeletonTypography content entirely. */
    children?: JSXElement;
    /** ref to the root <li> element. */
    ref?: CommonRef;
    /**
     * Number of skeleton `<li>` elements to render.
     * Each is an independent element with `:nth-child` width cycling applied by SCSS.
     * @default 1
     */
    count?: number;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 * Used by `ReactToJSX<ListboxOptionSkeletonProps, ListboxOptionSkeletonPropsToOverride>`.
 */
export type ListboxOptionSkeletonPropsToOverride = 'before' | 'after' | 'children';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListboxOptionSkeleton';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-listbox-option-skeleton';
/**
 * Legacy class name, emitted next to `CLASSNAME` for backward compatibility.
 *
 * @deprecated Use `CLASSNAME` (`lumx-listbox-*`). The legacy `lumx-combobox-*` class will be removed in the next major version.
 */
export const LEGACY_CLASSNAME = 'lumx-combobox-option-skeleton';

/**
 * ListboxOptionSkeleton core template.
 * Renders a skeleton placeholder `<li>` inside a combobox list, styled to match
 * option dimensions. Uses `role="none"` so screen readers ignore it.
 *
 * Width variation across sibling skeletons is handled by SCSS `:nth-child` rules,
 * not by props — the component itself does not need a `width` prop.
 *
 * @param props Component props.
 * @return JSX element.
 */
export const ListboxOptionSkeleton = (props: ListboxOptionSkeletonProps) => {
    const { hasDescription, children, className, ref, count = 1, ...forwardedProps } = props;

    const itemProps = {
        ref,
        size: 'tiny' as const,
        role: 'none',
        ...forwardedProps,
        className: classNames.join(className, CLASSNAME, LEGACY_CLASSNAME),
        children:
            children ||
            ((
                <>
                    <SkeletonTypography typography="body1" theme="light" />
                    {hasDescription && <SkeletonTypography typography="caption" theme="light" />}
                </>
            ) as JSXElement),
    };

    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <ListItem key={i} {...itemProps} />
            ))}
        </>
    );
};
