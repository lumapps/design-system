import { defineComponent, useAttrs } from 'vue';

import {
    RadioGroup as RadioGroupUI,
    CLASSNAME,
    COMPONENT_NAME,
    RadioGroupProps as UIProps,
} from '@lumx/core/js/components/RadioGroup';
import type { JSXElement } from '@lumx/core/js/types';

import { useClassName } from '../../composables/useClassName';
import { useId } from '../../composables/useId';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { provideRadioGroupContext } from './RadioGroupContext';

export type RadioGroupProps = VueToJSXProps<UIProps>;

export const emitSchema = {
    change: (value: string, name?: string, event?: Event) => event instanceof Event,
    /** Model update for `v-model:value`. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'update:value': (_value: string) => true,
};

export { CLASSNAME, COMPONENT_NAME };

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const RadioGroup = defineComponent(
    (props: RadioGroupProps, { emit, slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const generatedName = useId();

        const onChange = (value: string, name?: string, event?: Event) => {
            emit('change', value, name, event);
            emit('update:value', value);
        };

        provideRadioGroupContext({
            get value() {
                return props.value;
            },
            get name() {
                return props.name || generatedName;
            },
            onChange,
        });

        return () => <RadioGroupUI {...attrs} className={className.value} children={slots.default?.() as JSXElement} />;
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<RadioGroupProps>()('class', 'name', 'value'),
        emits: emitSchema,
    },
);

export default RadioGroup;
