import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { Message as UI, CLASSNAME, COMPONENT_NAME, MessageProps as UIProps } from '@lumx/core/js/components/Message';
import { GenericProps } from '@lumx/core/js/types';

export interface MessageProps extends GenericProps, Omit<UIProps, 'children' | 'ref'> {
    /** Content. */
    children?: React.ReactNode;
}

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
