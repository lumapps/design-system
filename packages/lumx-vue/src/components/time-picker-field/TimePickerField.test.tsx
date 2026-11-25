import { defineComponent, ref } from 'vue';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import timePickerFieldTests, { TRANSLATIONS } from '@lumx/core/js/components/TimePickerField/Tests';
import { getByClassName } from '@lumx/core/testing/queries';

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

    describe('Vue', () => {
        it('should give precedence to the beforeElement slot over the prop', () => {
            render(TimePickerField, {
                props: { label: 'Start time', translations: TRANSLATIONS, beforeElement: 'Before prop' },
                slots: { beforeElement: 'Before slot' },
            });
            const beforeElement = getByClassName(document.body, 'lumx-text-field__before-element');
            expect(beforeElement).toHaveTextContent('Before slot');
            expect(beforeElement).not.toHaveTextContent('Before prop');
        });

        it('should update v-model:value when an option is selected', async () => {
            render({
                template:
                    '<div><TimePickerField v-model:value="value" label="Start" locale="en-US" :translations="translations" /><span data-testid="out">{{ value ? `${value.getHours()}:${value.getMinutes()}` : \'\' }}</span></div>',
                components: { TimePickerField },
                data() {
                    return { value: undefined as Date | undefined, translations: TRANSLATIONS };
                },
            });
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.click(screen.getByRole('option', { name: '10:30 AM' }));

            expect(screen.getByTestId('out')).toHaveTextContent('10:30');
        });
    });
});
