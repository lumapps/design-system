import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

import { ButtonRoot as UI, ButtonRootProps } from '@lumx/core/js/components/Button/ButtonRoot';

export type { ButtonRootProps as BaseButtonProps };

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
        'aria-disabled': isAnyDisabled,
        ref,
    });
});
