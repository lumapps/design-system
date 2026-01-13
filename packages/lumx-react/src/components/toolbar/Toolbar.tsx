import { ReactNode } from 'react';

import { GenericProps } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ToolbarProps extends GenericProps {
    /** After content (placed after the label). */
    after?: ReactNode;
    /** Before content (placed before the label). */
    before?: ReactNode;
    /** Label content. */
    label?: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Toolbar';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-toolbar';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ToolbarProps> = {};

/**
 * Toolbar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Toolbar = forwardRef<ToolbarProps, HTMLDivElement>((props, ref) => {
    const { after, before, className, label, ...forwardedProps } = props;
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    'has-after': Boolean(after),
                    'has-before': Boolean(before),
                    'has-label': Boolean(label),
                },
                className,
            )}
        >
            {before && <div className={element('before')}>{before}</div>}
            {label && <div className={element('label')}>{label}</div>}
            {after && <div className={element('after')}>{after}</div>}
        </div>
    );
});
Toolbar.displayName = COMPONENT_NAME;
Toolbar.className = CLASSNAME;
Toolbar.defaultProps = DEFAULT_PROPS;
