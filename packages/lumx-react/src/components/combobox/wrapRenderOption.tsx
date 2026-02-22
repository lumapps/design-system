import React from 'react';

import type { JSXElement } from '@lumx/core/js/types';
import type { RenderOptionContext } from '@lumx/core/js/utils/select/types';

import { isComponentType } from '@lumx/react/utils/type';
import { ComboboxOption } from './ComboboxOption';

/** Render function passed as `renderOption` to a core Select* template. */
type WrappedRenderOption<O> = (option: O, context: RenderOptionContext) => JSXElement | null;

/**
 * Adapts a React `renderOption` callback returning a `<Combobox.Option>` into the
 * `renderOption` shape expected by the core Select* templates.
 *
 * Used by both `SelectTextField` and `SelectButton` React wrappers.
 *
 * Behavior:
 * - If `renderOption` is `undefined`, returns `undefined` (no custom rendering).
 * - If the consumer returns a `<Combobox.Option>`, its props/children are merged with the
 *   core-computed `value` / `isSelected` / `description` / `key`.
 * - If the consumer returns anything else, returns `null` (skips the option).
 *
 * @param renderOption Consumer-provided render function.
 * @return The wrapped `renderOption` callback or `undefined`.
 */
export function wrapRenderOption<O>(
    renderOption: ((option: O, index: number) => React.ReactNode) | undefined,
): WrappedRenderOption<O> | undefined {
    if (!renderOption) return undefined;
    return (option, { index, value: optionValue, isSelected, description }) => {
        const node = renderOption(option, index);
        if (!isComponentType(ComboboxOption)(node)) return null;
        const { children, ...customProps } = (node as React.ReactElement).props;
        return (
            <ComboboxOption
                key={optionValue}
                {...customProps}
                value={optionValue}
                isSelected={isSelected}
                description={description}
            >
                {children}
            </ComboboxOption>
        ) as unknown as JSXElement;
    };
}
