import { defineComponent, useAttrs } from 'vue';
import { Message as MessageUI, type MessageProps as UIProps } from '@lumx/core/js/components/Message';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type MessageProps = VueToJSXProps<Omit<UIProps, 'closeButtonProps'>> & {
    /** label to be used for the close button */
    closeButtonLabel?: string;
};

export interface MessageEmits {
    /** event emited when the Message is closed through the Close Button */
    close: [];
}

/**
 * Message component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Message = defineComponent(
    (props: MessageProps, { slots, emit }) => {
        const attrs = useAttrs();
        const { closeButtonLabel } = props;

        return () => (
            <MessageUI
                {...props}
                {...attrs}
                className={props.class}
                children={slots.default?.() as JSXElement}
                closeButtonProps={
                    closeButtonLabel
                        ? {
                              label: closeButtonLabel,
                              onClick: () => emit('close'),
                          }
                        : undefined
                }
            />
        );
    },
    {
        name: 'Message',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<MessageProps>()('hasBackground', 'icon', 'kind', 'class', 'closeButtonLabel'),
        emits: ['close'],
    },
);

export default Message;
