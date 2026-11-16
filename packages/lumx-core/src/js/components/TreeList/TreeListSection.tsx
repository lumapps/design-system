import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props for the core TreeListSection template.
 */
export interface TreeListSectionProps extends HasClassName {
    /** Section label, shown as the section title (visual only). Without a label, the section is a plain group. */
    label?: string | JSXElement;
    /** Section icon (shown before the label). */
    icon?: string;
    /** Section content (`TreeListItem` elements). */
    children?: JSXElement;
    /** Whether the filter hides every tree item of the section (internal). */
    hidden?: boolean;
    /** ref to the root `<li>` element. */
    ref?: CommonRef;
}

/**
 * Props that React/Vue wrappers need to re-declare with framework-specific types.
 */
export type TreeListSectionPropsToOverride = 'label' | 'children';

/**
 * Injected framework-specific components for TreeListSection rendering.
 */
export interface TreeListSectionComponents {
    /** ListSection component (framework-specific). */
    ListSection: any;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TreeListSection';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tree-list-section';

/**
 * TreeListSection core template: a section of root tree items in a `TreeList`, with an optional label. The
 * list sections get a divider between them (and between them and the standalone tree items).
 *
 * The section has no ARIA semantics (`role="none"` on the `<li>` and on the `<ul>`): in a tree, a
 * `role="group"` is the group of sub-items of a tree item, and it changes the level of its tree items. The
 * tree items of a section stay root tree items (`aria-level` 1).
 *
 * @param props Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const TreeListSection = (props: TreeListSectionProps, { ListSection }: TreeListSectionComponents) => {
    const { children, className, hidden, ...forwardedProps } = props;
    return (
        <ListSection
            {...forwardedProps}
            role="none"
            hidden={hidden || undefined}
            className={classNames.join(className, CLASSNAME)}
            // No `aria-labelledby` on the `<ul>`: a global ARIA attribute makes browsers ignore `role="none"`.
            itemsWrapperProps={{ role: 'none', 'aria-labelledby': undefined }}
        >
            {children}
        </ListSection>
    );
};

TreeListSection.displayName = COMPONENT_NAME;
TreeListSection.className = CLASSNAME;
