import { computed, defineComponent, ref, useAttrs } from 'vue';

import {
    RawInputTextarea as RawInputTextareaUI,
    type RawInputTextareaProps as UIProps,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/TextField/RawInputTextarea';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useFitRowsToContent } from './useFitRowsToContent';

export type RawInputTextareaProps = VueToJSXProps<UIProps>;

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
 * Raw input textarea component.
 * (textarea element without any decoration)
 *
 * @param  props Component props.
 * @return Vue element.
 */
const RawInputTextarea = defineComponent(
    (props: RawInputTextareaProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        const textareaRef = ref<HTMLTextAreaElement | null>(null);
        const rows = useFitRowsToContent(
            computed(() => props.rows ?? (DEFAULT_PROPS.rows as number)),
            textareaRef,
            computed(() => props.value),
        );

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
                <RawInputTextareaUI
                    {...(attrs as UIProps)}
                    ref={textareaRef}
                    value={props.value}
                    rows={rows.value}
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
        name: getName('RawInputTextarea'),
        inheritAttrs: false,
        props: keysOf<RawInputTextareaProps>()('class', 'theme', 'value', 'rows', 'name'),
        emits: emitSchema,
    },
);

export default RawInputTextarea;
