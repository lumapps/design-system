import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import {
    ButtonGroup as UI,
    ButtonGroupProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Button/ButtonGroup';

export type { ButtonGroupProps };

/**
 * ButtonGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonGroup = forwardRef<ButtonGroupProps, HTMLDivElement>((props, ref) => {
    return UI({ ref, ...props });
});

ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
