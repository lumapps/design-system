import { computed, defineComponent, provide, reactive, toRefs } from 'vue';

import type { HeadingElement } from '@lumx/core/js/types';
import type { HeadingLevelContext } from '@lumx/core/js/components/Heading/constants';
import { computeHeadingLevel } from '@lumx/core/js/components/Heading/utils';

import { keysOf } from '../../utils/VueToJSX';
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
        props: keysOf<HeadingLevelProviderProps>()('level'),
    },
);

export default HeadingLevelProvider;
