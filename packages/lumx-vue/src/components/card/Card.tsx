import { defineComponent, useAttrs, type NativeElements, type PublicProps } from 'vue';

import {
    Card as CardUI,
    type CardProps as UIProps,
    type DefaultCardTag,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Card';
import { type JSXElement } from '@lumx/core/js/types';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

/** Any intrinsic HTML/SVG tag name known to Vue's JSX. */
type CardTag = keyof NativeElements;

/** Public props: polymorphic on `as`, which also types the forwarded element attributes. */
export type CardProps<E extends CardTag = DefaultCardTag> = Omit<NativeElements[E], 'class'> &
    VueToJSXProps<UIProps, 'as'> & {
        /** Customize the rendered root element (e.g. `div`, `article`, `section`, `li`, `aside`), defaults to `div`. */
        as?: E;
    };

/** Props actually declared at runtime (non-polymorphic subset). */
type CardOwnProps = VueToJSXProps<UIProps, 'as'> & { as?: CardTag };

/**
 * Card component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Card = defineComponent(
    (props: CardOwnProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);

        return () => (
            <CardUI {...attrs} {...props} className={className.value} children={slots.default?.() as JSXElement} />
        );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<CardOwnProps>()('class', 'elevation', 'as'),
    },
);

/**
 * Vue's `defineComponent` setup-fn overload cannot carry an unbound generic from the setup
 * signature to the resulting component constructor (it collapses as soon as a runtime `props`
 * option is present), so the generic is layered on via cast
 */
interface CardConstructor {
    new <E extends CardTag = DefaultCardTag>(props: CardProps<E> & PublicProps): { $props: CardProps<E> };
}

export default Card as unknown as CardConstructor & typeof Card;
