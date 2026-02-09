let counter = 0;

/**
 * Generate a unique ID for use in components.
 * This is a simple implementation that generates sequential IDs.
 *
 * @return A unique ID string.
 */
export function useId(): string {
    counter += 1;
    return `:lumx${counter}:`;
}
