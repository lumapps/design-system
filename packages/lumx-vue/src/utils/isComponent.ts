import type { Component, VNode } from 'vue';

/**
 * Create a predicate function that checks if a VNode is an instance of the given component.
 *
 * @param  component Vue component
 * @return predicate returning true if value is instance of the component
 */
export const isComponent =
    <C extends Component>(component: C) =>
    (instance: VNode | VNode[] | null | undefined): instance is VNode => {
        if (!instance) {
            return false;
        }

        // Handle single VNode
        if (!Array.isArray(instance)) {
            return instance.type === component;
        }

        // Handle array of VNodes - check if the first element matches
        return instance.length > 0 && instance[0].type === component;
    };
