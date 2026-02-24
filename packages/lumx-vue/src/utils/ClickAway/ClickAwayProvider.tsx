import {
    defineComponent,
    inject,
    onBeforeUnmount,
    onMounted,
    provide,
    type InjectionKey,
    type PropType,
    type Ref,
} from 'vue';
import { setupClickAway, type ClickAwayCallback } from '@lumx/core/js/utils/ClickAway';

interface ContextValue {
    childrenRefs: HTMLElement[];
    addRefs(...newChildrenRefs: Array<Ref<HTMLElement | undefined>>): void;
}

export const CLICK_AWAY_KEY: InjectionKey<ContextValue> = Symbol('LumxClickAway');

/**
 * Component combining click away detection with Vue's provide/inject to hook into the component tree
 * and take into account both the DOM tree and the component tree to detect click away.
 */
export const ClickAwayProvider = defineComponent(
    (
        props: {
            callback: ClickAwayCallback;
            childrenRefs: Ref<Array<Ref<HTMLElement | undefined>>>;
            parentRef?: Ref<HTMLElement | undefined>;
        },
        { slots },
    ) => {
        const parentContext = inject(CLICK_AWAY_KEY, null);

        const contextChildrenRefs: HTMLElement[] = [];

        const currentContext: ContextValue = {
            childrenRefs: contextChildrenRefs,
            addRefs(...newChildrenRefs) {
                for (const newRef of newChildrenRefs) {
                    const el = newRef.value;
                    if (el) {
                        contextChildrenRefs.push(el);
                    }
                }
                if (parentContext) {
                    parentContext.addRefs(...newChildrenRefs);
                    if (props.parentRef) {
                        parentContext.addRefs(props.parentRef);
                    }
                }
            },
        };

        provide(CLICK_AWAY_KEY, currentContext);

        let teardown: (() => void) | undefined;

        onMounted(() => {
            const refs = props.childrenRefs.value;
            if (refs) {
                currentContext.addRefs(...refs);
            }

            // Setup click away using the context's collected refs directly
            teardown = setupClickAway(() => contextChildrenRefs, props.callback);
        });

        onBeforeUnmount(() => {
            teardown?.();
        });

        return () => slots.default?.();
    },
    {
        name: 'LumxClickAwayProvider',
        props: {
            callback: {
                type: [Function, Boolean, undefined] as PropType<ClickAwayCallback>,
                default: undefined,
            },
            childrenRefs: {
                type: Object as PropType<Ref<Array<Ref<HTMLElement | undefined>>>>,
                required: true,
            },
            parentRef: {
                type: Object as PropType<Ref<HTMLElement | undefined>>,
                default: undefined,
            },
        },
    },
);
