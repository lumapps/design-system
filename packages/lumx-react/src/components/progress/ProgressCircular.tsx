import { Theme, Size } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Progress sizes.
 */
export type ProgressCircularSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm'>;

/**
 * Defines the props of the component.
 */
export interface ProgressCircularProps extends GenericProps, HasTheme {
    /**
     * Progress circular size.
     */
    size?: ProgressCircularSize;
    /**
     * Progress display type (inline or block).
     * @default 'block'
     */
    display?: 'inline' | 'block';
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressCircular';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-progress-circular';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressCircularProps> = {
    size: Size.m,
    display: 'block',
};

/**
 * ProgressCircularProps component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressCircular = forwardRef<ProgressCircularProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        className,
        theme = defaultTheme,
        size = DEFAULT_PROPS.size,
        display = DEFAULT_PROPS.display,
        ...forwardedProps
    } = props;
    const Element = display === 'block' ? 'div' : 'span';

    return (
        <Element
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    [`size-${size}`]: Boolean(size),
                    [`display-${display}`]: Boolean(display),
                }),
            )}
        >
            <Element className={element('double-bounce1')} />
            <Element className={element('double-bounce2')} />

            <svg className={element('svg')} viewBox="25 25 50 50">
                <circle className={element('path')} cx="50" cy="50" r="20" fill="none" strokeWidth="5" />
            </svg>
        </Element>
    );
});
ProgressCircular.displayName = COMPONENT_NAME;
ProgressCircular.className = CLASSNAME;
ProgressCircular.defaultProps = DEFAULT_PROPS;
