import { VNode, isVNode, ConcreteComponent } from 'vue';
import get from 'lodash/get';

/**
 * Properties of a component to use to determine it's name.
 * In the order of preference.
 */
const NAME_PROPERTIES: string[] = ['type.name', 'type.displayName', 'type.__name'];

/**
 * Create a predicate function that checks if a VNode is a Vue element from the given component.
 *
 * @param  component Vue function component or the component name
 * @return predicate returning true if value is instance of the component
 */
export const isComponent =
    (component: ConcreteComponent<any> | string) =>
    (instance: VNode): boolean => {
        const componentName =
            typeof component === 'string'
                ? component
                : component.name || component.displayName || (component as any).__name;

        return (
            isVNode(instance) &&
            NAME_PROPERTIES.some((nameProperty: string): boolean => get(instance, nameProperty) === componentName)
        );
    };
