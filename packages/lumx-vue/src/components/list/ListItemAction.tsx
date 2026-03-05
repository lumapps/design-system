import { computed, defineComponent, ref, useAttrs } from 'vue';

import { ListItemAction as ListItemActionUI } from '@lumx/core/js/components/List/ListItemAction';
import type { BaseClickableProps, ClickableElement } from '@lumx/core/js/components/RawClickable';
import type { HasClassName, JSXElement } from '@lumx/core/js/types';

import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ListItemActionProps = VueToJSXProps<BaseClickableProps & HasClassName> & {
    /** Customize the rendered element. */
    as?: ClickableElement;
    /** Link href. */
    href?: string;
};

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

/**
 * ListItemAction component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ListItemAction = defineComponent(
    (props: ListItemActionProps, { emit, slots, expose }) => {
        const attrs = useAttrs();

        const actionRef = ref<HTMLElement>();
        expose({ $el: actionRef });

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: any) => {
            if (isAnyDisabled.value) {
                return;
            }
            emit('click', event);
        };

        return () => {
            const { className, ...rest } = otherProps.value as any;
            return (
                <ListItemActionUI
                    {...rest}
                    ref={actionRef}
                    className={(props.class || className) as string}
                    isDisabled={disabledStateProps.value.disabled}
                    aria-disabled={disabledStateProps.value['aria-disabled']}
                    handleClick={handleClick}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxListItemAction',
        inheritAttrs: false,
        props: keysOf<ListItemActionProps>()('as', 'href', 'class', 'isDisabled', 'disabled', 'aria-disabled'),
        emits: emitSchema,
    },
);

export default ListItemAction;
