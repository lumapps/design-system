import { Comment, Fragment, Text, type VNode } from 'vue';

/** Whether the rendered slot content is not empty (ignores comments, blank text and empty fragments). */
export function hasContent(nodes: unknown): boolean {
    if (!Array.isArray(nodes)) return false;
    return nodes.some((node: VNode) => {
        if (!node || typeof node !== 'object') return false;
        if (node.type === Comment) return false;
        if (node.type === Text) return String(node.children ?? '').trim() !== '';
        if (node.type === Fragment) return hasContent(node.children);
        return true;
    });
}
