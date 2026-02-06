import { defineComponent, useAttrs } from 'vue';

import { Flag as FlagUI, type FlagProps as UIProps } from '@lumx/core/js/components/Flag';
import type { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Text } from '../text';

export type FlagProps = VueToJSXProps<UIProps, 'Text'>;

/**
 * Flag component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Flag = defineComponent(
    (props: FlagProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => (
            <FlagUI
                {...props}
                {...attrs}
                className={props.class}
                theme={props.theme || defaultTheme}
                children={slots.default?.() as JSXElement}
                Text={Text as unknown as UIProps['Text']}
            />
        );
    },
    {
        name: 'Flag',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<FlagProps>()('color', 'icon', 'truncate', 'theme', 'class'),
    },
);

export default Flag;
