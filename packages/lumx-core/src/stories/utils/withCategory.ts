import setWith from 'lodash/setWith';

/**
 * Add table.category to the provided argTypes
 */
export function withCategory(category: string, argTypes: Record<string, any>) {
    const out: typeof argTypes = {};
    for (const [key, value] of Object.entries(argTypes)) {
        out[key] = setWith({ ...value }, 'table.category', category);
    }
    return out;
}
