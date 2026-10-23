import {
    CompositeStatus as UI,
    CompositeStatusProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Composite/CompositeStatus';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

/**
 * Props of the composite status (`Combobox.State`, `Listbox.State`).
 */
export type CompositeStatusProps = ReactToJSX<UIProps, 'state'>;

/**
 * CompositeStatus: the live region of a composite (list, grid or tree), exposed as `Combobox.State` and
 * `Listbox.State`. Displays the empty, loading, error and item count messages.
 *
 * Place this component as a sibling to `Combobox.List` inside a `Combobox.Popover` (or inside the list):
 *
 * ```tsx
 * <Combobox.Popover>
 *   <Combobox.List aria-label="Options">{options}</Combobox.List>
 *   <Combobox.State
 *     emptyMessage="No results"
 *     errorMessage={isError ? 'Service unavailable' : undefined}
 *     errorTryReloadMessage="Please try again"
 *   />
 * </Combobox.Popover>
 * ```
 *
 * Activation rules (in priority order):
 * - **Error state**: active when `errorMessage` is provided (presence-based).
 *   Takes priority over all other states.
 * - **Loading state**: active when `loadingMessage` is provided and skeletons have been
 *   mounted for at least 500ms. Suppresses the empty state while loading.
 * - **Empty state**: active when `emptyMessage` is provided and the composite has no visible items
 *   and is not loading.
 * - **Item count**: active when `nbOptionMessage` is provided and the composite is not empty,
 *   not loading, and not in error.
 *
 * @param props Component props.
 * @return React element.
 */
export const CompositeStatus = (props: CompositeStatusProps) => {
    const { handle: list } = useCompositeContext();
    const state = useCompositeEvent(list, 'stateChange', undefined);

    return UI({ ...props, state }, { GenericBlock, Text });
};

CompositeStatus.displayName = COMPONENT_NAME;
CompositeStatus.className = CLASSNAME;
