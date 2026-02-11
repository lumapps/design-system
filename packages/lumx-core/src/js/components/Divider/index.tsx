import type { LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends HasTheme, HasClassName {
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Divider';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-divider';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<DividerProps> = {};

/**
 * Divider component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Divider = (props: DividerProps) => {
    const { className, theme, ref, ...forwardedProps } = props;

    return (
        <hr
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`theme-${theme}`]: Boolean(theme) }))}
        />
    );
};
