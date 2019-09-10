import React, { ReactElement } from 'react';

import { Emphasis, Icon, Size, Theme } from 'LumX';
import { BaseButtonProps, ButtonRoot } from 'LumX/components/button/react/ButtonRoot';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { getRootClassName } from 'LumX/core/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends BaseButtonProps {
    /**
     * The icon used as the button label.
     * @see {@link IconProps#icon}
     */
    icon: string;
}
type IconButtonProps = IProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IconButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    emphasis: Emphasis.high,
    size: Size.m,
    theme: Theme.light,
};

/////////////////////////////

/**
 * Displays an icon button.
 *
 * @return The component.
 */
const IconButton: React.FC<IconButtonProps> = (props: IconButtonProps): ReactElement => {
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

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, IconButton, IconButtonProps };
