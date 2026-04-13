import { type Component, type VNode, isVNode } from 'vue';

/**
 * Returns a type guard that checks whether a VNode was created from a specific component.
 * Vue equivalent of `@lumx/react/utils/type/isComponentType`.
 */
export const isComponentType =
    (type: Component) =>
    (node: unknown): node is VNode =>
        isVNode(node) && node.type === type;
