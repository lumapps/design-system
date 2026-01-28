import { isVNode, createVNode, Fragment, VNodeArrayChildren, VNodeRef } from 'vue';
import { Icon } from '@lumx/vue/components/icon';

/** Force wrap spaces around icons to make sure they are never stuck against text. */
export function wrapChildrenIconWithSpaces(children: VNodeArrayChildren | undefined): VNodeArrayChildren | undefined {
    if (!children) return undefined;

    const wrappedChildren: VNodeArrayChildren = [];

    for (const child of children) {
        if (!isVNode(child)) {
            wrappedChildren.push(child);
            continue;
        }

        // Check if the node is an Icon component
        if (child.type === Icon) {
            wrappedChildren.push(' ');
            wrappedChildren.push(child);
            wrappedChildren.push(' ');
            continue;
        }

        // Handle Fragments (recurse and flatten)
        if (child.type === Fragment && Array.isArray(child.children)) {
            const updated = wrapChildrenIconWithSpaces(child.children as VNodeArrayChildren);
            if (updated) {
                wrappedChildren.push(...updated);
            }
            continue;
        }

        // Handle HTML elements with children array (recurse)
        if (typeof child.type === 'string' && Array.isArray(child.children)) {
            const updated = wrapChildrenIconWithSpaces(child.children as VNodeArrayChildren);

            // Re-create the VNode with updated children
            const props: Record<string, any> = { ...(child.props || {}) };
            if (child.key != null) props.key = child.key;
            if (child.ref != null) props.ref = child.ref as unknown as VNodeRef;

            wrappedChildren.push(createVNode(child.type, props, updated));
            continue;
        }

        wrappedChildren.push(child);
    }

    return wrappedChildren;
}
