import { ColorPalette, Size, Theme } from '../../constants';
import type { LumxClassName, HasTheme, JSXElement, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';
import { TextProps } from '../Text';

export interface FlagProps extends HasClassName, HasTheme {
    /** Color of the component. */
    color?: ColorPalette;
    /** Icon to use before the label. */
    icon?: string;
    /** Text label of the flag. */
    children: JSXElement;
    /** Enable text truncate on overflow */
    truncate?: boolean;
    /** ref to the root element */
    ref?: CommonRef;
    /** Text component to use for rendering the label */
    Text: (props: TextProps) => any;
}

export const COMPONENT_NAME = 'Flag';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-flag';
export const DEFAULT_PROPS: Partial<FlagProps> = {};
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Flag component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Flag = (props: FlagProps) => {
    const { children, icon, color, className, theme, truncate, Text, ...forwardedProps } = props;
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);
    const isTruncated = !!truncate;

    return (
        <div
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`color-${flagColor}`]: Boolean(flagColor),
                    'is-truncated': isTruncated,
                }),
            )}
        >
            {icon && Icon({ icon, size: Size.xxs, className: element('icon') })}
            <Text as="span" truncate={!!truncate} typography="overline" className={element('label')}>
                {children}
            </Text>
        </div>
    );
};
