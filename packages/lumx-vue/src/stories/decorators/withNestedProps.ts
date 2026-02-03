import set from 'lodash/set';

/**
 * Convert flattened props into nested props
 *
 * @example: toNestedProps({ 'foo.bar': 4 }) => { foo: { bar: 4 } }
 */
export function toNestedProps(flattenedProps: Record<string, any>): Record<string, any> {
    const props = {};
    for (const [key, value] of Object.entries(flattenedProps)) {
        set(props, key, value);
    }
    return props;
}

/**
 * SB decorator converting args from flattened props to nested props
 */
export const withNestedProps = () => {
    return (story: any, context: any) => {
        context.args = toNestedProps(context.args);
        return story();
    };
};
