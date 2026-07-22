/**
 * Picks the accessible-name prop (`aria-label` or `aria-labelledby`).
 */
export function resolveAccessibleNameProps(
    ariaLabel: string | undefined,
    ariaLabelledBy: string | undefined,
): { 'aria-label': string } | { 'aria-labelledby': string } | undefined {
    if (ariaLabel) {
        return { 'aria-label': ariaLabel };
    }
    if (ariaLabelledBy) {
        return { 'aria-labelledby': ariaLabelledBy };
    }
    return undefined;
}
