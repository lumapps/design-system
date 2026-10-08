import { defineComponent } from 'vue';

import {
    ListboxOptionAction as UI,
    type ListboxOptionActionProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOptionAction';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useListboxContext } from './context/ListboxContext';

export type ListboxOptionActionProps = Pick<VueToJSXProps<UIProps>, 'isDisabled' | 'class'> & {
    /** On click callback. */
    onClick?: (evt: MouseEvent) => void;
};

/**
 * Combobox.OptionAction sub-component.
 *
 * Renders a secondary action button within a combobox option row (grid mode).
 *
 * Renders nothing outside grid mode (`type="grid"` on the parent list): without the grid
 * navigation, an action would not be reachable by keyboard and would break the listbox pattern.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ListboxOptionAction = defineComponent(
    (props: ListboxOptionActionProps, { slots, attrs }) => {
        const actionId = useId();
        const className = useClassName(() => props.class);
        const { disabledStateProps, otherProps } = useDisableStateProps(props as any);
        const listboxContext = useListboxContext();
        let warned = false;

        return () => {
            if (listboxContext.type !== 'grid') {
                if (!warned) {
                    warned = true;
                    console.warn(
                        `[@lumx/vue/${COMPONENT_NAME}] Option actions are only supported in grid mode (set type="grid" on the parent list); the action is not rendered.`,
                    );
                }
                return null;
            }
            const children = slots.default?.() as JSXElement;
            const { onClick, class: _class, ...forwardedProps } = otherProps.value as any;
            return UI({
                as: 'button' as any,
                ...forwardedProps,
                ...attrs,
                ...disabledStateProps.value,
                id: actionId,
                className: className.value,
                handleClick: onClick,
                children,
            });
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListboxOptionActionProps>()('isDisabled', 'onClick', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ListboxOptionAction;
