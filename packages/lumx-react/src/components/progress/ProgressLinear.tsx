import { Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

export interface ProgressLinearProps extends GenericProps, HasTheme {}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressLinear';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-progress-linear';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressLinearProps> = {};

/**
 * ProgressLinear component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressLinear = forwardRef<ProgressLinearProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, ...forwardedProps } = props;
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    [`theme-${theme}`]: Boolean(theme),
                },
                className,
            )}
        >
            <div className={element('line1')} />
            <div className={element('line2')} />
        </div>
    );
});
ProgressLinear.displayName = COMPONENT_NAME;
ProgressLinear.className = CLASSNAME;
ProgressLinear.defaultProps = DEFAULT_PROPS;
