/** Pull an element from an array (inverse of array.push) */
export const pull = <T>(array: Array<T>, element: T) => {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
};
