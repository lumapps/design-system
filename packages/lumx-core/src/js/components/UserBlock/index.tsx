import type { HasClassName, LumxClassName, HasTheme, GenericProps, JSXElement, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { Orientation, Size } from '../../constants';

/**
 * User block sizes.
 */
export type UserBlockSize = Extract<Size, 'xs' | 's' | 'm' | 'l'>;

/**
 * Props for the UserBlock component.
 *
 * UserBlock displays user information with an avatar, name, and optional fields.
 * Supports both horizontal and vertical orientations with customizable actions.
 */
export interface UserBlockProps extends HasClassName, HasTheme {
    /**
     * Props to pass to the Avatar component.
     * Configure the user's avatar appearance and behavior.
     */
    avatarProps?: GenericProps;

    /**
     * Additional fields to display below the user's name.
     * Typically used for role, department, or other user metadata.
     */
    fields?: string[];

    /**
     * Props to pass to the Link component wrapping the avatar and/or name.
     * Used to make the user block clickable with navigation.
     */
    linkProps?: GenericProps;

    /**
     * Custom component to use for the link element.
     * Use this to inject a framework-specific router Link component (e.g., react-router Link).
     * @default 'a'
     */
    linkAs?: 'a' | any;

    /**
     * Content for multiple actions displayed in the action toolbar.
     * Only visible when orientation is vertical.
     */
    multipleActions?: JSXElement;

    /**
     * The user's display name.
     * Can be a string or custom JSX element.
     */
    name?: JSXElement;

    /**
     * Props to pass to the name wrapper element.
     * Used to customize the name block's appearance and behavior.
     */
    nameProps?: GenericProps;

    /**
     * Layout orientation of the user block.
     * - horizontal: Avatar and info side by side (default)
     * - vertical: Avatar and info stacked, forces size to 'l'
     * @default Orientation.horizontal
     */
    orientation?: Orientation;

    /**
     * Content for a single action displayed in the action toolbar.
     * Only visible when orientation is vertical.
     */
    simpleAction?: JSXElement;

    /**
     * Size variant of the component.
     * Note: When orientation is vertical, size is automatically forced to 'l'.
     * @default Size.m
     */
    size?: UserBlockSize;

    /**
     * Click event handler.
     * Called when the user clicks on the clickable area (name/avatar).
     */
    handleClick?(): void;

    /**
     * Mouse enter event handler.
     * Called when the mouse enters the component.
     */
    handleMouseEnter?(): void;

    /**
     * Mouse leave event handler.
     * Called when the mouse leaves the component.
     */
    handleMouseLeave?(): void;

    /**
     * Additional custom fields to display below the standard fields.
     * Only visible when size is not 'xs' or 's'.
     */
    additionalFields?: JSXElement;

    /**
     * Content to display after the entire component.
     * Position depends on orientation:
     * - horizontal: displayed to the right
     * - vertical: displayed at the bottom
     */
    after?: JSXElement;

    /**
     * Custom content to replace the default name block.
     * When provided, replaces the default name rendering.
     */
    children?: JSXElement;

    /**
     * Ref to attach to the root element.
     */
    ref?: CommonRef;

    /**
     * Text component for rendering text content.
     * Injected by the framework wrapper (React/Vue).
     */
    Text: (props: any) => any;

    /**
     * Avatar component for rendering the user avatar.
     * Injected by the framework wrapper (React/Vue).
     */
    Avatar: (props: any) => any;
}

export type UserBlockPropsToOverride = 'Avatar' | 'Text' | 'nameProps' | 'linkProps' | 'avatarProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'UserBlock';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-user-block';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<UserBlockProps> = {
    orientation: Orientation.horizontal,
    size: Size.m,
};

export const isUserBlockClickeable = ({
    linkAs,
    linkProps,
    handleClick,
}: Pick<UserBlockProps, 'linkAs' | 'linkProps' | 'handleClick'>) => {
    const isLink = Boolean(linkProps?.href || linkAs);
    const isClickable = !!handleClick || isLink;

    return isClickable;
};

/**
 * UserBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const UserBlock = (props: UserBlockProps) => {
    const {
        avatarProps,
        className,
        fields,
        linkProps,
        linkAs,
        ref,
        multipleActions,
        name,
        nameProps,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        orientation = DEFAULT_PROPS.orientation,
        simpleAction,
        size = DEFAULT_PROPS.size,
        theme,
        children,
        additionalFields,
        after,
        Text,
        Avatar,
        ...forwardedProps
    } = props;
    let componentSize = size;

    // Special case - When using vertical orientation force the size to be Sizes.l.
    if (orientation === Orientation.vertical) {
        componentSize = Size.l;
    }

    const shouldDisplayActions: boolean = orientation === Orientation.vertical;

    const isClickable = isUserBlockClickeable({ handleClick, linkAs, linkProps });

    const shouldDisplayFields = componentSize !== Size.s && componentSize !== Size.xs;

    const fieldsBlock = fields && shouldDisplayFields && (
        <div className={element('fields')}>
            {fields.map((field: string, idx: number) => (
                <Text as="span" key={idx} className={element('field')}>
                    {field}
                </Text>
            ))}
        </div>
    );

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`orientation-${orientation}`]: Boolean(orientation),
                    [`size-${componentSize}`]: Boolean(componentSize),
                    [`theme-${theme}`]: Boolean(theme),
                    'is-clickable': isClickable,
                }),
            )}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {avatarProps && (
                <Avatar
                    linkAs={linkAs}
                    linkProps={linkProps}
                    alt=""
                    {...(avatarProps as any)}
                    className={classNames.join(element('avatar'), avatarProps.className)}
                    size={componentSize}
                    onClick={handleClick}
                    theme={theme}
                />
            )}
            {(fields || name || children || additionalFields) && (
                <div className={element('wrapper')}>
                    {children}
                    {fieldsBlock}
                    {shouldDisplayFields ? additionalFields : null}
                </div>
            )}
            {shouldDisplayActions && simpleAction && <div className={element('action')}>{simpleAction}</div>}
            {shouldDisplayActions && multipleActions && <div className={element('actions')}>{multipleActions}</div>}
            {after ? <div className={element('after')}>{after}</div> : null}
        </div>
    );
};
