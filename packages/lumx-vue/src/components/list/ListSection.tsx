import { defineComponent, useAttrs } from 'vue';

import {
    ListSection as ListSectionUI,
    type ListSectionProps as UIProps,
} from '@lumx/core/js/components/List/ListSection';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Text } from '../text';

export type ListSectionProps = VueToJSXProps<UIProps, 'id' | 'Text'>;

/**
 * ListSection component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ListSection = defineComponent(
    (props: ListSectionProps, { slots }) => {
        const attrs = useAttrs();
        const id = useId();

        return () => (
            <ListSectionUI
                {...props}
                {...attrs}
                className={props.class}
                id={id}
                Text={Text as unknown as UIProps['Text']}
                children={slots.default?.() as JSXElement}
            />
        );
    },
    {
        name: 'LumxListSection',
        inheritAttrs: false,
        props: keysOf<ListSectionProps>()('label', 'icon', 'itemsWrapperProps', 'class'),
    },
);

export default ListSection;
