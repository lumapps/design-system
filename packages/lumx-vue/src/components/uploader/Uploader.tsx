import { computed, defineComponent, ref, useAttrs } from 'vue';

import {
    Uploader as UploaderUI,
    UploaderVariant,
    DEFAULT_PROPS,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Uploader';
import type { UploaderProps as UIProps, UploaderPropsToOverride } from '@lumx/core/js/components/Uploader';
import type { UploaderSize } from '@lumx/core/js/components/Uploader';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useId } from '../../composables/useId';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

type VueFileInputProps = {
    /** Accepted file types. */
    accept?: string;
    /** Whether multiple files can be selected. */
    multiple?: boolean;
    /** Camera capture mode. */
    capture?: boolean | 'user' | 'environment';
    /** Native input id (generated if not provided). */
    id?: string;
};

export type UploaderProps = VueToJSXProps<UIProps, UploaderPropsToOverride> & {
    /** Handle file selection with a native input file. */
    fileInputProps?: VueFileInputProps;
};

export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_files: File[], _event?: Event) => true,
};

export type { UploaderSize };
export { UploaderVariant, DEFAULT_PROPS, CLASSNAME, COMPONENT_NAME };

/**
 * Uploader component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Uploader = defineComponent(
    (props: UploaderProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);
        const generatedInputId = useId();
        const inputId = computed(() => props.fileInputProps?.id || generatedInputId);
        const isDragHovering = ref(false);

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                event.preventDefault();
                return;
            }
            event.stopImmediatePropagation();
            (attrs as any).onClick?.(event);
        };

        const handleChange = (event: Event) => {
            if (isAnyDisabled.value) return;
            event.stopImmediatePropagation();
            const input = event.target as HTMLInputElement;
            const files = input.files ? Array.from(input.files) : [];
            emit('change', files, event);
        };

        return () => {
            const hasFileInput = Boolean(props.fileInputProps);
            const {
                onClick: _onClick,
                fileInputProps: _fp,
                class: _class,
                theme: _theme,
                ...restProps
            } = otherProps.value as any;

            return (
                <UploaderUI
                    {...restProps}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    inputId={inputId.value}
                    isAnyDisabled={isAnyDisabled.value}
                    isDragHovering={isDragHovering.value}
                    handleClick={handleClick}
                    handleChange={handleChange}
                    Component={hasFileInput ? 'label' : 'button'}
                    fileInputProps={{
                        ...props.fileInputProps,
                        ...disabledStateProps.value,
                        readonly: isAnyDisabled.value,
                        onDrop: () => {
                            isDragHovering.value = false;
                        },
                        onDragleave: () => {
                            isDragHovering.value = false;
                        },
                        onDragenter: () => {
                            isDragHovering.value = true;
                        },
                    }}
                    {...(hasFileInput ? { htmlFor: inputId.value } : { type: 'button', ...disabledStateProps.value })}
                />
            );
        };
    },
    {
        name: 'LumxUploader',
        inheritAttrs: false,
        props: keysOf<UploaderProps>()(
            'class',
            'theme',
            'aspectRatio',
            'icon',
            'label',
            'size',
            'variant',
            'isDisabled',
            'disabled',
            'aria-disabled',
            'fileInputProps',
        ),
        emits: emitSchema,
    },
);

export default Uploader;
