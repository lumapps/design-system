import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

import {
    BUTTON_CLASSNAME,
    BUTTON_WRAPPER_CLASSNAME,
    BaseButtonProps,
    ButtonRoot as UI,
    ButtonRootProps,
    ButtonSize,
} from '@lumx/core/js/components/Button/ButtonRoot';

export type { ButtonRootProps, BaseButtonProps, ButtonSize };
export { BUTTON_WRAPPER_CLASSNAME, BUTTON_CLASSNAME };

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot = forwardRef<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);

    return UI({
        ...otherProps,
        ...disabledStateProps,
        ref,
        'aria-disabled': isAnyDisabled,
    });
});
