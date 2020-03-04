import React from 'react';

import { Emphasis, Icon, Size, Theme } from '@lumx/react';
import { BaseButtonProps, ButtonRoot } from '@lumx/react/components/button/ButtonRoot';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface IconButtonProps extends BaseButtonProps {
    /**
     * The icon used as the button label.
     * @see {@link IconProps#icon}
     */
    icon: string;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<IconButtonProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}IconButton`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    emphasis: Emphasis.high,
    size: Size.m,
    theme: Theme.light,
};

/**
 * Displays an icon button.
 *
 * @return The component.
 */
const IconButton: React.FC<IconButtonProps> = (props) => {
    const {
        emphasis = DEFAULT_PROPS.emphasis,
        icon,
        size = DEFAULT_PROPS.size,
        theme = DEFAULT_PROPS.theme,
        ...forwardedProps
    } = props;

    return (
        <ButtonRoot {...{ emphasis, size, theme, ...forwardedProps }} variant="icon">
            <Icon icon={icon} />
        </ButtonRoot>
    );
};
IconButton.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, IconButton, IconButtonProps };
