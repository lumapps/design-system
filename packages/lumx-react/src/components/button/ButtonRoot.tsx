import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { ButtonRoot as UI, ButtonRootProps, BaseButtonProps } from '@lumx/core/js/components/Button/ButtonRoot';

export type { ButtonRootProps, BaseButtonProps };

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot = forwardRef<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    return UI({
        ...props,
        ref,
    });
});
