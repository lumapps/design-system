import { defineComponent } from 'vue';

import {
    ComboboxOptionAction as UI,
    type ComboboxOptionActionProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOptionAction';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ComboboxOptionActionProps = Pick<VueToJSXProps<UIProps>, 'isDisabled' | 'class'> & {
    /** On click callback. */
    onClick?: (evt: MouseEvent) => void;
};

/**
 * Combobox.OptionAction sub-component.
 *
 * Renders a secondary action button within a combobox option row (grid mode).
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxOptionAction = defineComponent(
    (props: ComboboxOptionActionProps, { slots, attrs }) => {
        const actionId = useId();
        const { disabledStateProps, otherProps } = useDisableStateProps(props as any);

        return () => {
            const children = slots.default?.() as JSXElement;
            const { onClick, class: className, ...forwardedProps } = otherProps.value as any;
            return UI({
                as: 'button' as any,
                ...forwardedProps,
                ...attrs,
                ...disabledStateProps.value,
                id: actionId,
                className,
                handleClick: onClick,
                children,
            });
        };
    },
    {
        name: 'LumxComboboxOptionAction',
        inheritAttrs: false,
        props: keysOf<ComboboxOptionActionProps>()('isDisabled', 'onClick', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxOptionAction;
