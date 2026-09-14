import { isVNode, createVNode, Fragment, Text as TextVNode, VNodeArrayChildren, VNodeRef } from 'vue';
import { Icon } from '@lumx/vue/components/icon';

/** Read the text of a child, whether it is a raw string or a text VNode. */
function getText(node: unknown): string {
    if (typeof node === 'string') return node;
    if (isVNode(node) && node.type === TextVNode && typeof node.children === 'string') return node.children;
    return '';
}

/** Whether the node is a text that already ends with a space (a normal space or a non breaking space). */
const endsWithSpace = (node: unknown) => /\s$/.test(getText(node));

/** Whether the node is a text that already starts with a space (a normal space or a non breaking space). */
const startsWithSpace = (node: unknown) => /^\s/.test(getText(node));

/**
 * Recursively wrap icons with spaces.
 *
 * `isFirst`/`isLast` tell whether the given children are at the very start/end of the whole
 * children tree, so that an icon on an edge is detected even when nested in a fragment or element.
 */
function wrap(
    children: VNodeArrayChildren | undefined,
    isFirst: boolean,
    isLast: boolean,
): VNodeArrayChildren | undefined {
    if (!children) return undefined;

    const wrappedChildren: VNodeArrayChildren = [];

    for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        const childIsFirst = isFirst && index === 0;
        const childIsLast = isLast && index === children.length - 1;

        if (!isVNode(child)) {
            wrappedChildren.push(child);
            continue;
        }

        // Check if the node is an Icon component
        if (child.type === Icon) {
            // No space on the edges of the text: the icon is not stuck against anything there.
            // No space either when the adjacent text already provides one.
            if (!childIsFirst && !endsWithSpace(children[index - 1])) wrappedChildren.push(' ');
            wrappedChildren.push(child);
            if (!childIsLast && !startsWithSpace(children[index + 1])) wrappedChildren.push(' ');
            continue;
        }

        // Handle Fragments (recurse and flatten)
        if (child.type === Fragment && Array.isArray(child.children)) {
            const updated = wrap(child.children as VNodeArrayChildren, childIsFirst, childIsLast);
            if (updated) {
                wrappedChildren.push(...updated);
            }
            continue;
        }

        // Handle HTML elements with children array (recurse)
        if (typeof child.type === 'string' && Array.isArray(child.children)) {
            const updated = wrap(child.children as VNodeArrayChildren, childIsFirst, childIsLast);

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

/**
 * Force wrap spaces around icons to make sure they are never stuck against text.
 * Icons at the very start or end of the text are not padded on that side.
 * No space is added on a side where the adjacent text already provides one.
 */
export function wrapChildrenIconWithSpaces(children: VNodeArrayChildren | undefined): VNodeArrayChildren | undefined {
    return wrap(children, true, true);
}
