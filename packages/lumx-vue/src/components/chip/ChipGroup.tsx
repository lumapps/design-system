import { defineComponent, useAttrs } from 'vue';
import {
    ChipGroup as ChipGroupUI,
    type ChipGroupProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Chip/ChipGroup';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';
import { COMPAT_OPTIONS } from '../../utils/compat/compatOptions';

export type ChipGroupProps = VueToJSXProps<UIProps, never>;

const ChipGroup = defineComponent(
    (props: ChipGroupProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () => (
            <ChipGroupUI {...props} {...attrs} className={className.value} children={slots.default?.() as JSXElement} />
        );
    },
    {
        ...COMPAT_OPTIONS,
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ChipGroupProps>()('align', 'class'),
    },
);

export default ChipGroup;
