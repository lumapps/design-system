import { defineComponent, useAttrs } from 'vue';

import {
    ListDivider as ListDividerUI,
    type ListDividerProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/List/ListDivider';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { COMPAT_OPTIONS } from '../../utils/compat/compatOptions';

export type ListDividerProps = VueToJSXProps<UIProps>;

/**
 * ListDivider component.
 * Purely decorative, consider a `ListSection` with label for a better list structure.
 *
 * @return Vue element.
 */
const ListDivider = defineComponent(
    (props: ListDividerProps) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () => <ListDividerUI {...attrs} className={className.value} />;
    },
    {
        ...COMPAT_OPTIONS,
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListDividerProps>()('class'),
    },
);

export default ListDivider;
