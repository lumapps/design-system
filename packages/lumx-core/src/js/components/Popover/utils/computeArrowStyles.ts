import { type MiddlewareData } from '@floating-ui/dom';

/**
 * Compute arrow CSS styles from floating-ui middleware data.
 */
export function computeArrowStyles(arrowData?: MiddlewareData['arrow']): Record<string, string> | undefined {
    if (!arrowData) return undefined;
    return {
        left: arrowData.x != null ? `${arrowData.x}px` : '',
        top: arrowData.y != null ? `${arrowData.y}px` : '',
    };
}
