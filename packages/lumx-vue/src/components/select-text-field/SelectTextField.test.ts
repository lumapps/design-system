import { defineComponent, ref, h } from 'vue';
import { render } from '@testing-library/vue';

import selectTextFieldTests from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '.';
import { Combobox } from '../combobox';

/**
 * Render a SelectTextField template with controlled state management for Vue.
 * Manages a `value` state and wires it through the `onChange` prop.
 *
 * The `template` function is a JSX function (from the core tests) that receives
 * `{ value, onChange, ... }` and returns a VNode. We wrap it in a Vue component
 * that manages the reactive state.
 */
function renderWithState(template: (props: any) => any, initialArgs: Record<string, any> = {}) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref(initialArgs.value ?? undefined);
            return () => {
                const props = {
                    ...initialArgs,
                    value: value.value,
                    onChange: (v: any) => {
                        value.value = v;
                        initialArgs.onChange?.(v);
                    },
                };
                return template(props);
            };
        },
    });

    const result = render(Wrapper);
    return { ...result, container: result.container as unknown as HTMLElement };
}

describe('<SelectTextField>', () => {
    selectTextFieldTests({
        components: { SelectTextField, Combobox },
        renderWithState,
    });
});
