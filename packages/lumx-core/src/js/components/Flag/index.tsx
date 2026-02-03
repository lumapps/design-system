import { ColorPalette, Size, Theme } from '../../constants';
import { handleBasicClasses } from '../../utils/_internal/className';
import type { LumxClassName, GenericProps, HasTheme, JSXElement, NestedComponents } from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';

export interface FlagProps extends GenericProps, HasTheme {
    /** Color of the component. */
    color?: ColorPalette;
    /** Icon to use before the label. */
    icon?: string;
    /** Text label of the flag. */
    children: JSXElement;
    /** Enable text truncate on overflow */
    truncate?: boolean;
}

export const COMPONENT_NAME = 'Flag';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-flag';
export const DEFAULT_PROPS: Partial<FlagProps> = {};

/**
 * Flag component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const Flag = (props: FlagProps, nestedComponents?: NestedComponents) => {
    const { Text } = nestedComponents || {};
    const { children, icon, color, className, theme, truncate, ...forwardedProps } = props;
    const flagColor = color || (theme === Theme.light ? ColorPalette.dark : ColorPalette.light);
    const isTruncated = !!truncate;

    return (
        <div
            {...forwardedProps}
            className={classNames.join(
                className,
                handleBasicClasses({ prefix: CLASSNAME, color: flagColor, isTruncated }),
            )}
        >
            {icon && Icon({ icon, size: Size.xxs, className: `${CLASSNAME}__icon` })}
            <Text as="span" truncate={!!props.truncate} typography="overline" className={`${CLASSNAME}__label`}>
                {children}
            </Text>
        </div>
    );
};
