import { computed, defineComponent, type ComponentPublicInstance, ref, useAttrs, watch } from 'vue';

import {
    TextField as TextFieldUI,
    type TextFieldProps as UIProps,
    type TextFieldPropsToOverride,
    generateAccessibilityIds,
} from '@lumx/core/js/components/TextField/TextField';
import { type InputLabelProps } from '@lumx/core/js/components/InputLabel';
import { CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/TextField/constants';

import { useTheme } from '../../composables/useTheme';
import { useId } from '../../composables/useId';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useSlot } from '../../composables/useSlot';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { IconButton } from '../button';
import RawInputText from './RawInputText';
import RawInputTextarea from './RawInputTextarea';

/**
 * Adapter for the Vue IconButton that maps `className` (used by the core component)
 * to Vue's `class` prop.
 */
const IconButtonAdapter = (p: any) => {
    const { className, ...rest } = p;
    return <IconButton class={className} {...rest} />;
};

export type TextFieldProps = VueToJSXProps<UIProps, TextFieldPropsToOverride | 'chips'> & {
    /** Native input id property (generated if not provided). */
    id?: string;
    /** Props to pass to the clear button. If not specified, the button won't be displayed. */
    clearButtonProps?: { label: string; [key: string]: any };
    /** Native input name property. */
    name?: string;
    /** Native input type (only when multiline is disabled). */
    type?: string;
    /** Minimum rows for textarea (only when multiline is enabled). */
    minimumRows?: number;
    /** Additional label props. */
    labelProps?: InputLabelProps;
    /** Ref callback for the native input element. */
    inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
    /** Ref callback for the text field wrapper element. */
    textFieldRef?: (el: HTMLElement | null) => void;
};

export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (value: string, _name?: string, _event?: Event) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    input: (value: string, _name?: string, _event?: Event) => typeof value === 'string',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blur: (_event?: FocusEvent) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clear: (_event?: MouseEvent) => true,
};

export { CLASSNAME, COMPONENT_NAME };

/**
 * TextField component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const TextField = defineComponent(
    (props: TextFieldProps, { emit }) => {
        const attrs = useAttrs();
        const getChipsSlot = useSlot('chips');
        const defaultTheme = useTheme();
        const generatedId = useId();
        const textFieldId = computed(() => props.id || generatedId);
        const isFocus = ref(false);

        const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));

        // Track the native input element for inputRef forwarding.
        const rawInputInstance = ref<ComponentPublicInstance | null>(null);
        watch(
            rawInputInstance,
            (instance) => {
                const inputElement: HTMLInputElement | HTMLTextAreaElement | null = instance?.$el ?? instance ?? null;
                props.inputRef?.(inputElement);
            },
            { flush: 'sync' },
        );

        const accessibilityIds = computed(() =>
            generateAccessibilityIds(
                props.helper,
                props.error,
                generatedId,
                (attrs['aria-describedby'] as string) || undefined,
            ),
        );

        const handleChange = (value: string, name?: string, event?: any) => {
            emit('change', value, name, event);
        };

        const handleInput = (value: string, name?: string, event?: any) => {
            emit('input', value, name, event);
        };

        const handleFocus = (event?: any) => {
            isFocus.value = true;
            emit('focus', event);
        };

        const handleBlur = (event?: any) => {
            isFocus.value = false;
            emit('blur', event);
        };

        const handleClear = (event?: any) => {
            event?.stopImmediatePropagation();
            emit('change', '');
            emit('clear', event);
        };

        return () => {
            const theme = props.theme || defaultTheme.value;
            const { helperId, errorId, describedById } = accessibilityIds.value;

            // Filter out attrs handled explicitly so that unknown attrs (e.g. data-*, aria-*)
            // are forwarded to the native input element.
            const {
                class: _class,
                'aria-describedby': _ab,
                disabled: _d,
                isDisabled: _id,
                'aria-disabled': _aad,
                ariaDisabled: _ad,
                onChange: _oc,
                onInput: _oi,
                onFocus: _of,
                onBlur: _ob,
                chips: _chips,
                ...inputAttrs
            } = attrs as any;

            const inputCommonProps = {
                ...inputAttrs,
                id: textFieldId.value,
                value: props.value,
                name: props.name,
                placeholder: props.placeholder,
                theme,
                'aria-invalid': props.hasError || undefined,
                'aria-describedby': describedById,
                ...disabledStateProps.value,
                readOnly: !!disabledStateProps.value['aria-disabled'],
                onChange: handleChange,
                onInput: handleInput,
                onFocus: handleFocus,
                onBlur: handleBlur,
            };

            const input = (
                props.multiline ? (
                    <RawInputTextarea ref={rawInputInstance} {...inputCommonProps} rows={props.minimumRows} />
                ) : (
                    <RawInputText ref={rawInputInstance} {...inputCommonProps} type={props.type || 'text'} />
                )
            ) as any;

            return (
                <TextFieldUI
                    chips={getChipsSlot() ?? undefined}
                    error={props.error}
                    forceFocusStyle={props.forceFocusStyle}
                    hasError={props.hasError}
                    afterElement={props.afterElement}
                    helper={props.helper}
                    icon={props.icon}
                    isRequired={props.isRequired}
                    isValid={props.isValid}
                    label={props.label}
                    labelProps={props.labelProps}
                    maxLength={props.maxLength}
                    multiline={props.multiline}
                    placeholder={props.placeholder}
                    value={props.value}
                    className={props.class}
                    theme={theme}
                    id={textFieldId.value}
                    isAnyDisabled={isAnyDisabled.value}
                    helperId={helperId}
                    errorId={errorId}
                    isFocus={isFocus.value}
                    input={input}
                    textFieldRef={props.textFieldRef}
                    IconButton={IconButtonAdapter as any}
                    clearButtonProps={
                        props.clearButtonProps ? { ...props.clearButtonProps, onClick: handleClear } : undefined
                    }
                />
            );
        };
    },
    {
        name: 'LumxTextField',
        inheritAttrs: false,
        props: keysOf<TextFieldProps>()(
            'class',
            'theme',
            'value',
            'error',
            'forceFocusStyle',
            'hasError',
            'afterElement',
            'helper',
            'icon',
            'isRequired',
            'isValid',
            'label',
            'labelProps',
            'maxLength',
            'isDisabled',
            'disabled',
            'multiline',
            'placeholder',
            'aria-disabled',
            'id',
            'clearButtonProps',
            'name',
            'type',
            'minimumRows',
            'inputRef',
            'textFieldRef',
        ),
        emits: emitSchema,
    },
);

export default TextField;
