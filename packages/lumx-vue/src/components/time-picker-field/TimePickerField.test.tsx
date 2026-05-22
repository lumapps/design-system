import { defineComponent, ref } from 'vue';
import { render } from '@testing-library/vue';

import timePickerFieldTests from '@lumx/core/js/components/TimePickerField/Tests';

import { TimePickerField } from '.';

/**
 * Render a TimePickerField template with controlled state management for Vue.
 * Manages a `value` state and wires it through the `change` emit.
 *
 * The `template` function (from the core tests) receives `{ value, onChange, ... }`
 * and returns a VNode. We wrap it in a Vue component that manages the reactive state.
 */
function renderWithState(template: (props: any) => any, initialArgs: Record<string, any> = {}) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref<Date | undefined>(initialArgs.value ?? undefined);
            return () => {
                const props = {
                    ...initialArgs,
                    value: value.value,
                    onChange: (v: Date | undefined) => {
                        value.value = v;
                        initialArgs.onChange?.(v, undefined, undefined);
                    },
                };
                return template(props);
            };
        },
    });

    const result = render(Wrapper);
    return { ...result, container: result.container as unknown as HTMLElement };
}

describe('<TimePickerField>', () => {
    timePickerFieldTests({
        components: { TimePickerField },
        renderWithState,
    });
});
