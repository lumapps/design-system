import { ColorPalette, Icon, Size, Theme, Text } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface FlagProps extends GenericProps, HasTheme {
    /** Color of the component. */
    color?: ColorPalette;
    /** Icon to use before the label. */
    icon?: string;
    /** Text label of the flag. */
    label: React.ReactNode;
    /** Enable text truncate on overflow */
    truncate?: boolean;
}

const COMPONENT_NAME = 'Flag';
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-flag';
const DEFAULT_PROPS: Partial<FlagProps> = {};

/**
 * Flag component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Flag = forwardRef<FlagProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { label, icon, color, className, theme = defaultTheme, truncate, ...forwardedProps } = props;
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);
    const isTruncated = !!truncate;
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <div
            {...forwardedProps}
            className={block(
                {
                    [`color-${flagColor}`]: Boolean(flagColor),
                    'is-truncated': isTruncated,
                },
                className,
            )}
            ref={ref}
        >
            {icon && <Icon icon={icon} size={Size.xxs} className={element('icon')} />}
            <Text as="span" truncate={isTruncated} typography="overline" className={element('label')}>
                {label}
            </Text>
        </div>
    );
});
Flag.displayName = COMPONENT_NAME;
Flag.className = CLASSNAME;
Flag.defaultProps = DEFAULT_PROPS;
