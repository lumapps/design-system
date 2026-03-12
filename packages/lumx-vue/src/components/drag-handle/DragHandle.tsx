import { defineComponent, useAttrs } from 'vue';

import {
    DragHandle as DragHandleUI,
    type DragHandleProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/DragHandle';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type DragHandleProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * DragHandle component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const DragHandle = defineComponent(
    (props: DragHandleProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme({ defaultTheme: undefined });

        return () => {
            return (
                <DragHandleUI {...attrs} {...props} className={props.class} theme={props.theme || defaultTheme.value} />
            );
        };
    },
    {
        name: 'LumxDragHandle',
        inheritAttrs: false,
        props: keysOf<DragHandleProps>()('class', 'theme'),
    },
);

export default DragHandle;
