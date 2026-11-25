import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import radioGroupTests from '@lumx/core/js/components/RadioGroup/Tests';
import { CLASSNAME, RadioGroupProps } from '@lumx/core/js/components/RadioGroup';
import { commonTestsSuiteVTL, renderWithState, SetupRenderOptions } from '@lumx/vue/testing';

import { RadioButton, RadioGroup } from '.';

describe('<RadioGroup />', () => {
    radioGroupTests({ components: { RadioGroup, RadioButton }, renderWithState });

    const setup = (props: Partial<RadioGroupProps> = {}, options: SetupRenderOptions<RadioGroupProps> = {}) => {
        const renderResult = render(RadioGroup, {
            props,
            ...options,
        });

        const radioGroup = renderResult.container.querySelector(`.${CLASSNAME}`);

        return { ...renderResult, radioGroup, props };
    };

    describe('Vue-specific', () => {
        it('updates v-model:value when a radio is clicked', async () => {
            render({
                template:
                    '<RadioGroup v-model:value="selected" name="fruit"><RadioButton label="A" value="a" /><RadioButton label="B" value="b" /></RadioGroup><span data-testid="out">{{ selected }}</span>',
                components: { RadioGroup, RadioButton },
                data() {
                    return { selected: 'a' };
                },
            });
            await userEvent.click(screen.getByRole('radio', { name: 'B' }));
            expect(screen.getByTestId('out')).toHaveTextContent('b');
        });

        it('emits change and update:value once each for one click', async () => {
            const { emitted } = render(RadioGroup, {
                props: { name: 'fruit' },
                slots: {
                    default: () => [
                        h(RadioButton, { label: 'A', value: 'a' }),
                        h(RadioButton, { label: 'B', value: 'b' }),
                    ],
                },
            });
            await userEvent.click(screen.getByRole('radio', { name: 'B' }));
            expect(emitted('change')).toHaveLength(1);
            expect(emitted('update:value')).toHaveLength(1);
        });

        it('leaves v-model:value unchanged when a disabled radio is clicked', async () => {
            render({
                template:
                    '<RadioGroup v-model:value="selected" name="fruit"><RadioButton label="A" value="a" /><RadioButton label="B" value="b" :is-disabled="true" /></RadioGroup><span data-testid="out">{{ selected }}</span>',
                components: { RadioGroup, RadioButton },
                data() {
                    return { selected: 'a' };
                },
            });
            await userEvent.click(screen.getByRole('radio', { name: 'B' }));
            expect(screen.getByTestId('out')).toHaveTextContent('a');
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'radioGroup',
        forwardAttributes: 'radioGroup',
    });
});
