import { defineComponent, useAttrs } from 'vue';

import {
    RawInputText as RawInputTextUI,
    type RawInputTextProps as UIProps,
} from '@lumx/core/js/components/TextField/RawInputText';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type RawInputTextProps = VueToJSXProps<UIProps>;

export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (value: string, _name?: string, _event?: Event) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input: (value: string, _name?: string, _event?: Event) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blur: (_event?: FocusEvent) => true,
};

/**
 * Raw input text component.
 * (input element without any decoration)
 *
 * @param  props Component props.
 * @return Vue element.
 */
const RawInputText = defineComponent(
    (props: RawInputTextProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        const handleChange = (value: string, name?: string, event?: any) => {
            event?.stopImmediatePropagation();
            emit('change', value, name, event);
        };

        const handleInput = (value: string, name?: string, event?: any) => {
            emit('input', value, name, event);
        };

        const handleFocus = (event?: any) => {
            emit('focus', event);
        };

        const handleBlur = (event?: any) => {
            emit('blur', event);
        };

        return () => {
            return (
                <RawInputTextUI
                    {...(attrs as UIProps)}
                    value={props.value}
                    type={props.type}
                    name={props.name}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    handleChange={handleChange}
                    handleInput={handleInput}
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                />
            );
        };
    },
    {
        name: getName('RawInputText'),
        inheritAttrs: false,
        props: keysOf<RawInputTextProps>()('class', 'theme', 'value', 'type', 'name'),
        emits: emitSchema,
    },
);

export default RawInputText;
