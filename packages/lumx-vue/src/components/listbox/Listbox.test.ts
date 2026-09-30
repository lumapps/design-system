import { render } from '@testing-library/vue';
import { defineComponent, ref } from 'vue';
import identity from 'lodash/identity';

import listboxTests from '@lumx/core/js/components/Listbox/Tests';
import { Combobox, IconButton } from '@lumx/vue';
import { Listbox } from '.';

/**
 * Renders a template with controlled state management.
 * Vue equivalent of the React renderWithState helper.
 */
function renderWithState(
    template: (props: any) => any,
    initialArgs: Record<string, any> = {},
    {
        onChangeProp = 'onChange',
        valueExtract = identity,
    }: { onChangeProp?: string; valueExtract?: (v: any) => any } = {},
) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref(initialArgs.value ?? '');

            return () => {
                const props = {
                    ...initialArgs,
                    value: value.value,
                    [onChangeProp]: (...args: any[]) => {
                        value.value = valueExtract(args[0]);
                        initialArgs[onChangeProp]?.(...args);
                    },
                };
                return template(props);
            };
        },
    });

    const { unmount, container } = render(Wrapper);
    return { unmount, container: container as HTMLElement };
}

describe('<Listbox> (internal)', () => {
    listboxTests({ components: { Listbox, Combobox, IconButton }, renderWithState });
});
