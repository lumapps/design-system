import { defineComponent, useAttrs } from 'vue';

import { Icon as IconUI, type IconProps as UIProps } from '@lumx/core/js/components/Icon';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type IconProps = VueToJSXProps<UIProps>;

/**
 * Icon component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Icon = defineComponent(
    (props: IconProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme({ defaultTheme: undefined });

        return () => <IconUI {...props} {...attrs} className={props.class} theme={props.theme || defaultTheme.value} />;
    },
    {
        name: 'Icon',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<IconProps>()(
            'icon',
            'color',
            'colorVariant',
            'hasShape',
            'size',
            'alt',
            'verticalAlign',
            'theme',
            'class',
        ),
    },
);

export default Icon;
