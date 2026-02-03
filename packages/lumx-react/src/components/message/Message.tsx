import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { Message as UI, CLASSNAME, COMPONENT_NAME, MessageProps } from '@lumx/core/js/components/Message';

export type { MessageProps };

/**
 * Message component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Message = forwardRef<MessageProps, HTMLDivElement>((props, ref) => {
    return UI({
        ...props,
        ref,
    });
});

Message.displayName = COMPONENT_NAME;
Message.className = CLASSNAME;
