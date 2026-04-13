import { defineComponent, useAttrs } from 'vue';
import {
    Toolbar as ToolbarUI,
    type ToolbarProps as UIProps,
    CLASSNAME,
    TOOLBAR_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Toolbar';
import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import type { JSXElement } from '@lumx/core/js/types';

export type ToolbarProps = VueToJSXProps<UIProps, 'label' | 'after' | 'before'>;

export { CLASSNAME, TOOLBAR_NAME, DEFAULT_PROPS };

const Toolbar = defineComponent(
    (props: ToolbarProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () => {
            // Fall back to attrs for before/label/after to support core JSX calling
            // Toolbar with props (React-style) instead of named slots (Vue-style).
            return (
                <ToolbarUI
                    {...props}
                    {...attrs}
                    className={className.value}
                    label={(slots.default?.() ?? (attrs as any).label) as JSXElement}
                    before={(slots.before?.() ?? (attrs as any).before) as JSXElement}
                    after={(slots.after?.() ?? (attrs as any).after) as JSXElement}
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
