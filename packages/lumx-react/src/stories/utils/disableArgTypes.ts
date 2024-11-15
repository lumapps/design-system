export function disableArgTypes(argTypes: string[]) {
    return Object.fromEntries(argTypes.map((argType) => [argType, { table: { disable: true } }]));
}
