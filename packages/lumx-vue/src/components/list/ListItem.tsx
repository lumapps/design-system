import { computed, defineComponent, toRaw, useAttrs } from 'vue';

import {
    ListItem as ListItemUI,
    type ListItemProps as UIProps,
    type ListItemSize,
} from '@lumx/core/js/components/List/ListItem';
import type { JSXElement } from '@lumx/core/js/types';

import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import ListItemAction from './ListItemAction';

export type { ListItemSize };

export type ListItemProps = VueToJSXProps<UIProps, 'after' | 'before' | 'linkRef'>;

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ListItem = defineComponent(
    (props: ListItemProps, { emit, slots }) => {
        const attrs = useAttrs();

        const hasOnClick = useHasEventListener('onClick');

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
            const { linkAs, ...rest } = otherProps.value;

            return (
                <ListItemUI
                    {...rest}
                    className={props.class}
                    isDisabled={disabledStateProps.value.disabled}
                    aria-disabled={disabledStateProps.value['aria-disabled']}
                    linkAs={toRaw(linkAs)}
                    handleClick={hasOnClick ? handleClick : undefined}
                    before={(slots.before?.() as JSXElement) || undefined}
                    after={(slots.after?.() as JSXElement) || undefined}
                    children={(slots.default?.() as JSXElement) || undefined}
                />
            );
        };
    },
    {
        name: 'LumxListItem',
        inheritAttrs: false,
        props: keysOf<ListItemProps>()(
            'isHighlighted',
            'isSelected',
            'isDisabled',
            'linkAs',
            'linkProps',
            'size',
            'class',
            'aria-disabled',
        ),
        emits: emitSchema,
    },
);

export default Object.assign(ListItem, { Action: ListItemAction });
