import { defineComponent, ref, useAttrs } from 'vue';

import {
    ListSection as ListSectionUI,
    type ListSectionProps as UIProps,
} from '@lumx/core/js/components/List/ListSection';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
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
    (props: ListSectionProps, { slots, expose }) => {
        const attrs = useAttrs();
        const id = useId();
        const className = useClassName(() => props.class);

        // Expose the root <li> element so parent components (e.g. ComboboxSection)
        // can access the DOM element via template ref without manual $el unwrapping.
        const rootRef = ref<HTMLElement>();
        expose({ $el: rootRef });

        return () => (
            <ListSectionUI
                {...props}
                {...attrs}
                ref={rootRef}
                className={className.value}
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
