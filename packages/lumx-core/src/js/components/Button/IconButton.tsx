import { Emphasis, Size } from '../../constants';
import { BaseButtonProps, ButtonRoot } from './ButtonRoot';
import { Icon } from '../Icon';
import type { LumxClassName } from '../../types';

export interface IconButtonProps extends /* @vue-ignore */ BaseButtonProps {
    /**
     * Icon (SVG path).
     * If `image` is also set, `image` will be used instead.
     */
    icon?: string;
    /**
     * Image (image url).
     * Has priority over `icon`.
     */
    image?: string;
    /**
     * Label text (required for a11y purpose).
     * If you really don't want an aria-label, you can set an empty label (this is not recommended).
     */
    label: string;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'IconButton';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-icon-button';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<IconButtonProps> = {
    emphasis: Emphasis.high,
    size: Size.m,
};

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const IconButton = (props: IconButtonProps) => {
    const {
        emphasis = DEFAULT_PROPS.emphasis,
        image,
        icon,
        label,
        size = DEFAULT_PROPS.size,
        ...forwardedProps
    } = props;

    const defaultChildren = image ? (
        <img
            // no need to set alt as an aria-label is already set on the button
            alt=""
            src={image}
        />
    ) : (
        Icon({ icon: icon as string })
    );

    return ButtonRoot({
        emphasis,
        size,
        ...forwardedProps,
        'aria-label': label,
        variant: 'icon',
        children: defaultChildren,
    });
};

IconButton.displayName = COMPONENT_NAME;
IconButton.className = CLASSNAME;
IconButton.defaultProps = DEFAULT_PROPS;
