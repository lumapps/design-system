import type { JSXElement, LumxClassName, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface ToolbarProps extends HasClassName {
    /** After content (placed after the label). */
    after?: JSXElement;
    /** Before content (placed before the label). */
    before?: JSXElement;
    /** Label content. */
    label?: JSXElement;
    /** Component ref. */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const TOOLBAR_NAME = 'Toolbar';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof TOOLBAR_NAME> = 'lumx-toolbar';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ToolbarProps> = {};

/**
 * Toolbar component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Toolbar = (props: ToolbarProps) => {
    const { after, before, className, label, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    'has-after': Boolean(after),
                    'has-before': Boolean(before),
                    'has-label': Boolean(label),
                }),
            )}
        >
            {before && <div className={element('before')}>{before}</div>}
            {label && <div className={element('label')}>{label}</div>}
            {after && <div className={element('after')}>{after}</div>}
        </div>
    );
};
