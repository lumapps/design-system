import { defineComponent, useAttrs } from 'vue';
import {
    GridColumn as GridColumnUI,
    type GridColumnProps as UIProps,
    type GridColumnGapSize,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/GridColumn';
import { type JSXElement } from '@lumx/core/js/types';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type GridColumnProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };
export type { GridColumnGapSize };

const GridColumn = defineComponent(
    (props: GridColumnProps, { slots }) => {
        const attrs = useAttrs();

        return () => (
            <GridColumnUI {...props} {...attrs} className={props.class} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: 'LumxGridColumn',
        inheritAttrs: false,
        props: keysOf<GridColumnProps>()('as', 'class', 'gap', 'itemMinWidth', 'maxColumns', 'style'),
    },
);

export default GridColumn;
