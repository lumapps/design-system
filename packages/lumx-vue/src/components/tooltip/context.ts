import { inject, provide } from 'vue';

/** Empty object used as marker context value */
type TooltipContextValue = NonNullable<unknown>;

const TOOLTIP_CONTEXT_KEY = Symbol('tooltip-context');
const DEFAULT_VALUE = {};

/**
 * Provide tooltip context marker to child components.
 * Used to detect when a component is inside a tooltip (e.g., to prevent nested tooltips).
 */
export function provideTooltipContext() {
    provide(TOOLTIP_CONTEXT_KEY, DEFAULT_VALUE);
}

/**
 * Inject tooltip context marker.
 * Returns the context value if inside a tooltip, undefined otherwise.
 */
export function useTooltipContext(): TooltipContextValue | undefined {
    return inject(TOOLTIP_CONTEXT_KEY, undefined);
}
