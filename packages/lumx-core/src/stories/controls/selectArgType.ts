export const getSelectArgType = <E>(
    options: Array<E> | Record<string, E>,
    type: 'select' | 'inline-radio' = 'inline-radio',
) => ({
    control: { type },
    options: Object.values(options),
    mapping: !Array.isArray(options) ? options : undefined,
});
