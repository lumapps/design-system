import React from 'react';

import type { JSXElement } from '@lumx/core/js/types';
import type { RenderOptionContext } from '@lumx/core/js/utils/select/types';

import { isComponentType } from '@lumx/react/utils/type';
import { ComboboxOption } from './ComboboxOption';

/** Render function passed as `renderOption` to a core Select* template. */
type WrappedRenderOption<O> = (option: O, context: RenderOptionContext) => JSXElement | null;

/** Join two optional nodes in order (skips undefined/null). */
function joinNodes(first: React.ReactNode, second: React.ReactNode): React.ReactNode {
    if (first == null) return second;
    if (second == null) return first;
    return (
        <>
            {first}
            {second}
        </>
    );
}

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
 *   When the consumer's `<Combobox.Option>` has no children, falls back to the option `name`.
 *   The core-computed selection icons are kept: `before` is prepended to the custom `before`,
 *   `after` is appended to the custom `after`.
 * - If the consumer returns anything else, returns `null` (skips the option).
 *
 * @param renderOption Consumer-provided render function.
 * @return The wrapped `renderOption` callback or `undefined`.
 */
export function wrapRenderOption<O>(
    renderOption: ((option: O, index: number) => React.ReactNode) | undefined,
): WrappedRenderOption<O> | undefined {
    if (!renderOption) return undefined;
    return (option, { index, value: optionValue, isSelected, description, name, before, after }) => {
        const node = renderOption(option, index);
        if (!isComponentType(ComboboxOption)(node)) {
            return null;
        }

        const {
            children = name,
            before: customBefore,
            after: customAfter,
            ...customProps
        } = (node as React.ReactElement).props;
        return (
            <ComboboxOption
                key={optionValue}
                {...customProps}
                value={optionValue}
                isSelected={isSelected}
                description={description}
                before={joinNodes(before, customBefore)}
                after={joinNodes(customAfter, after)}
            >
                {children}
            </ComboboxOption>
        ) as JSXElement;
    };
}
