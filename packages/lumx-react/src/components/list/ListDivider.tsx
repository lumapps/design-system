import { GenericProps } from '@lumx/react/utils/type';
import {
    ListDivider as UI,
    ListDividerProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/List/ListDivider';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export type ListDividerProps = GenericProps & ReactToJSX<UIProps>;

/**
 * ListDivider component.
 * Purely decorative, consider a `ListSection` with label for a better list structure.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListDivider = forwardRef<ListDividerProps, HTMLLIElement>((props, ref) => {
    return UI({ ...props, ref });
});
ListDivider.displayName = COMPONENT_NAME;
ListDivider.className = CLASSNAME;
ListDivider.defaultProps = DEFAULT_PROPS;
