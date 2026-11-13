import { Children, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { GenericProps } from '@lumx/core/js/types';
import {
    TreeListSection as UI,
    TreeListSectionProps as UIProps,
    TreeListSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeListSection';
import type { TreeListSectionState } from '@lumx/core/js/components/TreeList/types';
import { isTreeListHandle } from '@lumx/core/js/components/TreeList/utils';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { ListSection } from '../list/ListSection';
import { CompositeContext } from '../composite/CompositeContext';

/**
 * Props for the TreeListSection component.
 */
export interface TreeListSectionProps
    extends GenericProps,
        ReactToJSX<UIProps, TreeListSectionPropsToOverride | 'hidden'> {
    /** Section label, shown as the section title (visual only). Without a label, the section is a plain group. */
    label?: ReactNode;
    /** Section content (`TreeListItem` elements). */
    children: ReactNode;
}

/**
 * TreeListSection component: a section of root tree items in a `TreeList`, with an optional label (`TreeList.Section`).
 *
 * - The sections get a divider between them (and between them and the standalone tree items). Use a section
 *   without a label as a separator.
 * - Root level only: the tree items of a section are root tree items. Do not use it in a tree item.
 * - With `filter="auto"`, the section is hidden when the filter hides all of its tree items.
 * - The label is visual only: the section has no ARIA semantics (a group in a tree changes the tree item levels).
 * - Returns null without children.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const TreeListSection = forwardRef<TreeListSectionProps, HTMLLIElement>((props, ref) => {
    const { children, label, ...forwardedProps } = props;
    const compositeContext = useContext(CompositeContext);
    const handle = compositeContext?.handle;
    const tree = isTreeListHandle(handle) ? handle : null;
    const isNested = !!compositeContext?.level;
    useEffect(() => {
        if (isNested) {
            console.warn(`[@lumx/react/${COMPONENT_NAME}] ${COMPONENT_NAME} must be used at the root of a TreeList.`);
        }
    }, [isNested]);
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const [state, setState] = useState<TreeListSectionState>({ hidden: false });

    const hasChildren = Children.count(children) > 0;

    // Register on the tree for the filter state (the tree items of the section register before it).
    // Run again when the section starts to render (children added after the first render).
    useEffect(() => {
        const element = internalRef.current;
        if (!element || !tree) return undefined;
        return tree.registerSection(element, setState);
    }, [tree, hasChildren]);

    if (!hasChildren) return null;

    return UI(
        {
            ...forwardedProps,
            ref: mergedRef,
            label,
            hidden: state.hidden,
            children,
        },
        { ListSection },
    );
});

TreeListSection.displayName = COMPONENT_NAME;
TreeListSection.className = CLASSNAME;
