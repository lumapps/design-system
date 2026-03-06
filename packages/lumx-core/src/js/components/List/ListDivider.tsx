import type { CommonRef, HasClassName, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface ListDividerProps extends HasClassName {
    /** ref to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListDivider';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-divider';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ListDividerProps> = {};

/**
 * ListDivider component.
 * Purely decorative, consider a `ListSection` with label for a better list structure.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ListDivider = (props: ListDividerProps) => {
    const { className, ref, ...forwardedProps } = props;

    return <li ref={ref} role="none" {...forwardedProps} className={classNames.join(className, CLASSNAME)} />;
};

ListDivider.displayName = COMPONENT_NAME;
ListDivider.className = CLASSNAME;
ListDivider.defaultProps = DEFAULT_PROPS;
