import { ReactNode } from 'react';

import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ListSubheaderProps extends GenericProps {
    /** Content. */
    children: string | ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListSubheader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list-subheader';

/**
 * ListSubheader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListSubheader = forwardRef<ListSubheaderProps, HTMLLIElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);

    return (
        <li ref={ref} {...forwardedProps} className={block([className])}>
            {children}
        </li>
    );
});
ListSubheader.displayName = COMPONENT_NAME;
ListSubheader.className = CLASSNAME;
