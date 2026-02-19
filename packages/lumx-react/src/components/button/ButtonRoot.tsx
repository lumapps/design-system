import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

import {
    BUTTON_CLASSNAME,
    BUTTON_WRAPPER_CLASSNAME,
    BaseButtonProps,
    ButtonRoot as UI,
    ButtonRootProps as UIProps,
    ButtonSize,
} from '@lumx/core/js/components/Button/ButtonRoot';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export type { BaseButtonProps, ButtonSize };
export { BUTTON_WRAPPER_CLASSNAME, BUTTON_CLASSNAME };

export interface ButtonRootProps extends ReactToJSX<UIProps> {
    /** callback for clicking on the button */
    onClick?: (event?: React.MouseEvent) => void;
}

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot = forwardRef<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const { onClick, ...restOfOtherProps } = otherProps;

    return UI({
        ...restOfOtherProps,
        ...disabledStateProps,
        handleClick: onClick,
        ref,
        'aria-disabled': isAnyDisabled,
    });
});
