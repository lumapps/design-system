import { defineComponent, useAttrs } from 'vue';
import {
    Toolbar as ToolbarUI,
    type ToolbarProps as UIProps,
    CLASSNAME,
    TOOLBAR_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Toolbar';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import type { JSXElement } from '@lumx/core/js/types';

export type ToolbarProps = VueToJSXProps<UIProps, 'label' | 'after' | 'before'>;

export { CLASSNAME, TOOLBAR_NAME, DEFAULT_PROPS };

const Toolbar = defineComponent(
    (props: ToolbarProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            return (
                <ToolbarUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    label={slots.default?.() as JSXElement}
                    before={slots.before?.() as JSXElement}
                    after={slots.after?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxToolbar',
        inheritAttrs: false,
        props: keysOf<ToolbarProps>()('class'),
    },
);

export default Toolbar;
