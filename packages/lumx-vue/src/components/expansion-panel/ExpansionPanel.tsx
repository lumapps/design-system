import { defineComponent, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue';

import {
    ExpansionPanel as UI,
    type ExpansionPanelProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ExpansionPanelPropsToOverride,
    element,
} from '@lumx/core/js/components/ExpansionPanel';
import { IS_BROWSER } from '@lumx/core/js/constants';
import type { JSXElement } from '@lumx/core/js/types';

import IconButton from '../button/IconButton';
import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ExpansionPanelProps = VueToJSXProps<UIProps, ExpansionPanelPropsToOverride> & {
    /** Props to pass to the toggle button (minus those already set by the ExpansionPanel). */
    toggleButtonProps?: { label: string; [key: string]: any };
};

export const emitSchema = {
    open: (event: MouseEvent) => event instanceof MouseEvent,
    close: (event: MouseEvent) => event instanceof MouseEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleOpen: (shouldOpen: boolean, event: MouseEvent) => typeof shouldOpen === 'boolean',
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * ExpansionPanel component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ExpansionPanel = defineComponent(
    (props: ExpansionPanelProps, { emit, slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        const wrapperRef = ref<HTMLDivElement | null>(null);
        const isChildrenVisible = ref<boolean | undefined>(props.isOpen);
        const isOpenRef = ref(props.isOpen);

        watch(
            () => props.isOpen,
            (isOpen) => {
                isOpenRef.value = isOpen;
                if (isOpen || props.closeMode === 'hide') {
                    isChildrenVisible.value = true;
                } else if (!IS_BROWSER) {
                    isChildrenVisible.value = false;
                }
            },
            { immediate: true },
        );

        let removeTransitionListener: (() => void) | undefined;

        onMounted(() => {
            if (!IS_BROWSER || !wrapperRef.value) return;
            const onTransitionEnd = () => {
                isChildrenVisible.value = isOpenRef.value || props.closeMode === 'hide';
            };
            wrapperRef.value.addEventListener('transitionend', onTransitionEnd);
            removeTransitionListener = () => wrapperRef.value?.removeEventListener('transitionend', onTransitionEnd);
        });

        onUnmounted(() => {
            removeTransitionListener?.();
        });

        const handleOpen = (event: MouseEvent) => {
            event.stopImmediatePropagation();
            emit('open', event);
        };

        const handleClose = (event: MouseEvent) => {
            event.stopImmediatePropagation();
            emit('close', event);
        };

        const handleToggleOpen = (shouldOpen: boolean, event: MouseEvent) => {
            event.stopImmediatePropagation();
            emit('toggleOpen', shouldOpen, event);
        };

        return () => {
            const headerSlot = slots.header?.();
            const headerContent = headerSlot ? headerSlot : <span class={element('label')}>{props.label}</span>;

            return (
                <UI
                    {...attrs}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    isOpen={props.isOpen}
                    label={props.label}
                    hasBackground={props.hasBackground}
                    hasHeaderDivider={props.hasHeaderDivider}
                    closeMode={props.closeMode || DEFAULT_PROPS.closeMode}
                    toggleButtonProps={props.toggleButtonProps || { label: '' }}
                    handleOpen={handleOpen as any}
                    handleClose={handleClose as any}
                    handleToggleOpen={handleToggleOpen as any}
                    headerProps={{}}
                    headerContent={headerContent as JSXElement}
                    dragHandle={slots['drag-handle']?.() as JSXElement}
                    content={slots.default?.() as JSXElement}
                    footer={slots.footer?.() as JSXElement}
                    wrapperRef={wrapperRef}
                    isChildrenVisible={isChildrenVisible.value}
                    IconButton={IconButton}
                />
            );
        };
    },
    {
        name: 'LumxExpansionPanel',
        inheritAttrs: false,
        props: keysOf<ExpansionPanelProps>()(
            'class',
            'closeMode',
            'hasBackground',
            'hasHeaderDivider',
            'isOpen',
            'label',
            'theme',
            'toggleButtonProps',
        ),
        emits: emitSchema,
    },
);

export default ExpansionPanel;
