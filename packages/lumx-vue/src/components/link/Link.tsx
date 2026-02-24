import { computed, defineComponent, toRaw, useAttrs, useSlots } from 'vue';

import { Link as LinkUI, type LinkProps as UIProps, CLASSNAME } from '@lumx/core/js/components/Link';

import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';

export type LinkProps = VueToJSXProps<UIProps>;

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

const { element } = classNames.bem(CLASSNAME);

/**
 * Link component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Link = defineComponent(
    (props: LinkProps, { emit }) => {
        const slots = useSlots();
        const attrs = useAttrs();

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('click', event);
        };

        return () => {
            const { linkAs, ...rest } = otherProps.value;
            return (
                <LinkUI
                    {...rest}
                    linkAs={toRaw(linkAs)}
                    {...disabledStateProps.value}
                    className={props.class}
                    handleClick={handleClick as any}
                    children={(<span className={element('content')}>{slots.default?.()}</span>) as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxLink',
        inheritAttrs: false,
        props: keysOf<LinkProps>()(
            'color',
            'colorVariant',
            'href',
            'isDisabled',
            'disabled',
            'linkAs',
            'target',
            'typography',
            'class',
            'aria-disabled',
        ),
        emits: emitSchema,
    },
);

export default Link;
