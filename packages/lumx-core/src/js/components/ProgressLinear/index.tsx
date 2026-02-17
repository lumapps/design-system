import type { CommonRef, HasClassName, HasTheme, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface ProgressLinearProps extends HasTheme, HasClassName {
    /** Component ref */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ProgressLinear';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-progress-linear';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ProgressLinearProps> = {};

/**
 * ProgressLinear component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ProgressLinear = (props: ProgressLinearProps) => {
    const { className, theme, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <div className={element('line1')} />
            <div className={element('line2')} />
        </div>
    );
};
