import { defineComponent, ref, watchEffect } from 'vue';
import {
    InfiniteScroll as UI,
    type InfiniteScrollProps,
    setupInfiniteScrollObserver,
} from '@lumx/core/js/utils/InfiniteScroll';
import { keysOf } from '../VueToJSX';

export type { InfiniteScrollProps };

/**
 * Handles basic callback pattern by using intersection observers.
 */
export const InfiniteScroll = defineComponent(
    (props: InfiniteScrollProps) => {
        const elementRef = ref<HTMLDivElement | null>(null);

        watchEffect((onCleanup) => {
            const element = elementRef.value;
            if (!element) return;

            const cleanup = setupInfiniteScrollObserver(element, props.callback, props.options);
            onCleanup(cleanup);
        });

        return () => UI({ ref: elementRef });
    },
    {
        name: 'LumxInfiniteScroll',
        inheritAttrs: false,
        props: keysOf<InfiniteScrollProps>()('callback', 'options'),
    },
);

export default InfiniteScroll;
