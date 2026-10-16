import { defineComponent } from 'vue';

import {
    CompositeStatus as UI,
    type CompositeStatusProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Composite/CompositeStatus';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

export type CompositeStatusProps = VueToJSXProps<UIProps, 'state'>;

/**
 * CompositeStatus: the live region of a composite (list, grid or tree), exposed as `Combobox.State` and
 * `Listbox.State`. Displays the empty, loading, error and item count messages.
 *
 * @param props Component props.
 * @return Vue element.
 */
const CompositeStatus = defineComponent(
    (props: CompositeStatusProps) => {
        const { handle: list } = useCompositeContext();
        const state = useCompositeEvent(list, 'stateChange', undefined);

        return () =>
            UI(
                {
                    emptyMessage: props.emptyMessage,
                    nbOptionMessage: props.nbOptionMessage,
                    errorMessage: props.errorMessage,
                    errorTryReloadMessage: props.errorTryReloadMessage,
                    loadingMessage: props.loadingMessage,
                    state: state.value,
                },
                { GenericBlock, Text },
            );
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<CompositeStatusProps>()(
            'emptyMessage',
            'nbOptionMessage',
            'errorMessage',
            'errorTryReloadMessage',
            'loadingMessage',
            'class',
        ),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default CompositeStatus;
