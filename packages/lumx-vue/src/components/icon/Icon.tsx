import { defineComponent, inject, useAttrs } from 'vue';
import { Icon as IconUI, type IconProps as UIProps } from '@lumx/core/js/components/Icon';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type IconProps = VueToJSXProps<UIProps, 'ref'>;

/**
 * Icon component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Icon = defineComponent(
    (props: IconProps) => {
        const attrs = useAttrs();
        const defaultTheme = inject('theme', undefined);

        return () => <IconUI {...attrs} {...props} className={props.class} theme={props.theme || defaultTheme} />;
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
