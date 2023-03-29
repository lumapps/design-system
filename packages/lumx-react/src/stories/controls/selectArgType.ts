export const getSelectArgType = <E>(options: Array<E> | Record<string, E>) => ({
    control: { type: 'select' },
    options,
});
