/** Cast a value into an array if needed */
export const castArray = <T>(arrayOrElement: T[] | T) =>
    Array.isArray(arrayOrElement) ? arrayOrElement : [arrayOrElement];
