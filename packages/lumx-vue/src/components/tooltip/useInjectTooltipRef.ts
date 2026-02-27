import { h, cloneVNode, Fragment, Comment, Text, type VNode } from 'vue';

interface Options {
    /** Slot content (default slot VNodes) */
    slotContent: VNode[] | undefined;
    /** Set tooltip anchor element */
    setAnchorElement: (el: HTMLElement | null) => void;
    /** Whether the tooltip is mounted */
    isMounted: boolean;
    /** Tooltip id */
    id: string;
    /** Tooltip label */
    label?: string | null | false;
    /** Choose how the tooltip text should link to the anchor */
    ariaLinkMode: 'aria-describedby' | 'aria-labelledby';
}

/**
 * Flatten Fragment nodes from slot content (slots may wrap content in Fragments).
 */
function renderSlotFragments(children: VNode[]): VNode[] {
    return children.flatMap((child) => {
        if (child.type === Fragment) {
            return renderSlotFragments(child.children as VNode[]);
        }
        return [child];
    });
}

/**
 * Check if a VNode has isDisabled or disabled props.
 */
function isDisabledVNode(vnode: VNode): boolean {
    const props = vnode.props || {};
    return props.disabled === true || props.isDisabled === true;
}

/**
 * Inject ref and ARIA attributes into tooltip anchor slot content.
 * - For a single non-disabled element slot: clone with injected ref and ARIA attributes.
 * - For text/fragment/multiple children/disabled elements: wrap in a div.
 */
export function useInjectTooltipRef(options: Options): VNode {
    const { slotContent, setAnchorElement, isMounted, id, label, ariaLinkMode } = options;

    // No tooltip needed
    if (!slotContent || !label) {
        return h(Fragment, slotContent);
    }

    const children = renderSlotFragments(slotContent);
    const firstChild = children.find((c) => c.type !== Comment);

    // Only add link when mounted
    const linkId = isMounted ? id : undefined;

    // Single non-disabled element slot: clone with injected props
    // Skip text nodes (Symbol(v-txt)) as they can't receive refs
    if (firstChild && children.length === 1 && firstChild.type !== Text && !isDisabledVNode(firstChild)) {
        const extraProps: Record<string, any> = { ref: setAnchorElement };

        // Do not add label/description if the tooltip label is already in aria-label
        if (linkId && label !== firstChild.props?.['aria-label']) {
            const existing = firstChild.props?.[ariaLinkMode];
            extraProps[ariaLinkMode] = existing ? `${existing} ${linkId}` : linkId;
        }

        return cloneVNode(firstChild, extraProps, true);
    }

    // Fallback: wrap in a <div>
    const wrapperProps: Record<string, any> = {
        class: 'lumx-tooltip-anchor-wrapper',
        ref: setAnchorElement,
    };

    if (linkId) {
        wrapperProps[ariaLinkMode] = linkId;
    }

    return h('div', wrapperProps, slotContent);
}
