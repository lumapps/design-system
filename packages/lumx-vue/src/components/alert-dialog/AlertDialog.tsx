import { Text as TextVNode, computed, defineComponent, shallowRef, useAttrs } from 'vue';
import { AlertDialog as UI, COMPONENT_NAME, type BaseAlertDialogProps } from '@lumx/core/js/components/AlertDialog';
import type { DialogSizes } from '@lumx/core/js/components/Dialog';
import type { GenericProps, JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { keysOf } from '../../utils/VueToJSX';

import Dialog from '../dialog/Dialog';
import Button from '../button/Button';
import Icon from '../icon/Icon';
import Toolbar from '../toolbar/Toolbar';

type ButtonActionProps = {
    label: string;
    onClick?: () => void;
    [key: string]: any;
};

export interface AlertDialogProps extends Pick<BaseAlertDialogProps, 'kind' | 'title'> {
    /** Additional class name. */
    class?: string;
    /** Size variant. */
    size?: DialogSizes;
    /** Whether the dialog is open. */
    isOpen?: boolean;
    /** Reference to the parent element that triggered modal opening. */
    parentElement?: HTMLElement;
    /** Additional props for the dialog container element. */
    dialogProps?: GenericProps;
    /** Props forwarded to the confirm button. */
    confirmProps: ButtonActionProps;
    /** Props forwarded to the cancel button. Will not render a cancel button if undefined. */
    cancelProps?: ButtonActionProps;
    /** Unique identifier for the dialog. Generated automatically if not provided. */
    id?: string;
}

export const emitSchema = {
    close: () => true,
};

/**
 * AlertDialog component.
 *
 * An alert dialog is a modal dialog that interrupts the user's workflow to
 * communicate an important message and acquire a response.
 *
 * It should not have a complex content.
 * Children of this component should only be strings, paragraphs or links.
 */
const AlertDialog = defineComponent(
    (props: AlertDialogProps, { emit, slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const generatedId = useId();
        const uniqueId = computed(() => props.id || generatedId);

        const cancelButtonEl = shallowRef<HTMLElement | undefined>(undefined);
        const confirmButtonEl = shallowRef<HTMLElement | undefined>(undefined);

        return () => {
            const children = slots.default?.();
            const isStringContent = children?.length === 1 && children[0].type === TextVNode;
            const DescriptionElement = isStringContent ? 'p' : 'div';

            // isOpen, parentElement and onClose are not in core's AlertDialogProps but flow
            // through to Dialog via ...forwardedProps — spread to avoid excess property checking.
            const dialogPassthrough = {
                isOpen: props.isOpen,
                parentElement: props.parentElement,
                onClose: () => emit('close'),
            };

            // Inject vnode lifecycle hooks into button props to capture DOM elements for focus
            // management. We intentionally omit cancelButtonRef/confirmationButtonRef from the
            // UI() call so core's focusElement fallback stays undefined (not a callback function).
            const confirmProps = {
                ...props.confirmProps,
                onVnodeMounted: (vnode: any) => {
                    confirmButtonEl.value = vnode.el;
                },
                onVnodeUnmounted: () => {
                    confirmButtonEl.value = undefined;
                },
            };
            const cancelProps = props.cancelProps && {
                ...props.cancelProps,
                onVnodeMounted: (vnode: any) => {
                    cancelButtonEl.value = vnode.el;
                },
                onVnodeUnmounted: () => {
                    cancelButtonEl.value = undefined;
                },
            };

            return UI({
                ...attrs,
                ...dialogPassthrough,
                Button,
                Dialog,
                Icon,
                Toolbar,
                DescriptionElement,
                focusElement: props.cancelProps ? cancelButtonEl.value : confirmButtonEl.value,
                className: className.value,
                id: uniqueId.value,
                kind: props.kind,
                size: props.size,
                title: props.title,
                dialogProps: props.dialogProps,
                confirmProps,
                cancelProps,
                children: children as JSXElement,
            });
        };
    },
    {
        name: COMPONENT_NAME,
        inheritAttrs: false,
        props: keysOf<AlertDialogProps>()(
            'class',
            'kind',
            'title',
            'size',
            'isOpen',
            'parentElement',
            'dialogProps',
            'confirmProps',
            'cancelProps',
            'id',
        ),
        emits: emitSchema,
    },
);

export default AlertDialog;
