import { defineComponent, useAttrs } from 'vue';
import {
    BadgeWrapper as BadgeWrapperUI,
    type BadgeWrapperProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Badge/BadgeWrapper';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import type { JSXElement } from '@lumx/core/js/types';

export type BadgeWrapperProps = VueToJSXProps<UIProps>;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

const BadgeWrapper = defineComponent(
    (props: BadgeWrapperProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            return (
                <BadgeWrapperUI
                    {...props}
                    {...attrs}
                    className={props.class}
                    badge={(props.badge || slots.badge?.()) as JSXElement}
                    children={slots.default?.() as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxBadgeWrapper',
        inheritAttrs: false,
        props: keysOf<BadgeWrapperProps>()('badge', 'class'),
    },
);

export default BadgeWrapper;
