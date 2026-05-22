import { type ComputedRef, type Slot, computed, useAttrs } from 'vue';
import castArray from 'lodash/castArray';

import type { JSXElement } from '@lumx/core/js/types';
import type { RenderOptionContext } from '@lumx/core/js/utils/select/types';

import { isComponentType } from '../../utils/isComponentType';
import ComboboxOption from './ComboboxOption';

/** Render function passed as `renderOption` to a core Select* template. */
type WrappedRenderOption = (option: unknown, context: RenderOptionContext) => JSXElement;

/** Raw callback shape accepted as the `renderOption` attr fallback. */
type RenderOptionCallback = (option: unknown, context: RenderOptionContext) => unknown;

/**
 * Adapts a Vue scoped slot returning a `<ComboboxOption>` into the `renderOption`
 * callback shape expected by the core Select* templates.
 */
export function useWrappedRenderOptionSlot(slot: Slot | undefined): ComputedRef<WrappedRenderOption | undefined> {
    const attrs = useAttrs();

    return computed(() => {
        const renderOptionAttr = attrs.renderOption as RenderOptionCallback | undefined;

        if (!slot && !renderOptionAttr) return undefined;

        return (option: unknown, context: RenderOptionContext) => {
            const { index, value: optionValue, isSelected, description, name } = context;
            // Use slot or fallback on attrs.renderOption (needed for lumx-core compat)
            const vnodes = slot?.({ option, index }) || renderOptionAttr?.(option, context);
            const customOption = castArray(vnodes)?.find(isComponentType(ComboboxOption));

            // Fallback: consumer didn't return a <Combobox.Option> — render their VNodes as-is.
            if (!customOption) return vnodes as unknown as JSXElement;

            // Extract slot-overridable props; drop undefined so they don't clobber core defaults.
            const slotProps: Record<string, any> = customOption.props || {};
            const definedSlotProps = Object.fromEntries(Object.entries(slotProps).filter(([, v]) => v !== undefined));

            // `before`/`after` may be passed as JSX props (attrs) — promote them to named slots.
            const { before: beforeProp, after: afterProp, ...restSlotProps } = definedSlotProps;

            // Handle slots overrides (default, before and after)
            const slotChildren = { ...(customOption.children as Record<string, any>) };
            if (beforeProp !== undefined && !slotChildren.before) {
                slotChildren.before = () => beforeProp;
            }
            if (afterProp !== undefined && !slotChildren.after) {
                slotChildren.after = () => afterProp;
            }
            // Fallback: use the resolved option name as the default slot if not provided.
            if (!slotChildren.default) {
                slotChildren.default = name;
            }

            return (
                <ComboboxOption
                    key={optionValue}
                    value={optionValue}
                    isSelected={isSelected}
                    description={description ?? undefined}
                    {...restSlotProps}
                >
                    {slotChildren}
                </ComboboxOption>
            ) as JSXElement;
        };
    });
}
