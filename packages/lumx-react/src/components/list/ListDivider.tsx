import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type ListDividerProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListDivider';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-divider';

/**
 * ListDivider component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListDivider = forwardRef<ListDividerProps, HTMLLIElement>((props, ref) => {
    const { className, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);

    return <li ref={ref} {...forwardedProps} className={block([className])} />;
});
ListDivider.displayName = COMPONENT_NAME;
ListDivider.className = CLASSNAME;
