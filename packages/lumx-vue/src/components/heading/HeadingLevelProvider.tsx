import { defineComponent, computed, provide, reactive, toRefs } from 'vue';

import { HeadingElement } from '@lumx/core/js/types';
import { HeadingLevelContext } from '@lumx/core/js/components/Heading/constants';
import { computeHeadingLevel } from '@lumx/core/js/components/Heading/utils';

import { HeadingLevelContextKey } from './context';
import { useHeadingLevel } from './useHeadingLevel';

export interface HeadingLevelProviderProps {
    /** The heading level to start at. If left undefined, the parent context will be used, if any. */
    level?: number;
}

/**
 * HeadingLevelProvider component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const HeadingLevelProvider = defineComponent(
    (props: HeadingLevelProviderProps, { slots }) => {
        const { level: propLevel } = toRefs(props);
        const parentContext = useHeadingLevel();

        const nextLevel = computed(() => {
            return computeHeadingLevel(propLevel?.value, parentContext.level);
        });

        const headingElement = computed(() => `h${nextLevel.value}` as HeadingElement);

        const context = reactive({
            level: nextLevel,
            headingElement,
        });

        provide(HeadingLevelContextKey, context as HeadingLevelContext);

        return () => slots.default?.();
    },
    {
        name: 'HeadingLevelProvider',
        props: {
            level: {
                type: Number,
                required: false,
                default: undefined,
            },
        },
    },
);

export default HeadingLevelProvider;
