import React, { Children, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar, Size, Theme, Tooltip } from '@lumx/react';
import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { AvatarProps } from '../avatar/Avatar';

/**
 * Comment block variants.
 */
export const CommentBlockVariant = {
    indented: 'indented',
    linear: 'linear',
} as const;
export type CommentBlockVariant = ValueOf<typeof CommentBlockVariant>;

/**
 * Defines the props of the component.
 */
export interface CommentBlockProps extends GenericProps, HasTheme {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Props to pass to the avatar. */
    avatarProps: AvatarProps;
    /** Comment block replies. */
    children?: ReactNode;
    /** Comment date with the minimal timestamp information (xx minutes, x hours, yesterday, 6 days, Month Day, Month Day Year)*/
    date?: string;
    /** Comment date with the full timestamp information (day, month, year, time) */
    fullDate?: string;
    /** Whether the component has actions to display or not. */
    hasActions?: boolean;
    /** Action toolbar header content. */
    headerActions?: ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the comment is relevant or not. */
    isRelevant?: boolean;
    /** Comment author name. */
    name?: React.ReactNode;
    /**
     * On click callback.
     * @deprecated Use avatarProps instead and/or inject a clickable component in `name`
     */
    onClick?(): void;
    /**
     * On mouse enter callback.
     * @deprecated Use avatarProps instead and/or inject a clickable component in `name`
     */
    onMouseEnter?(): void;
    /**
     * On mouse leave callback.
     * @deprecated Use avatarProps instead and/or inject a clickable component in `name`
     */
    onMouseLeave?(): void;
    /** Comment content. */
    text: ReactNode | string;
    /** Comment variant. */
    variant?: CommentBlockVariant;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'CommentBlock';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<CommentBlockProps> = {
    variant: CommentBlockVariant.indented,
};

/**
 * CommentBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const CommentBlock = forwardRef<CommentBlockProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actions,
        avatarProps,
        children,
        className,
        date,
        fullDate,
        hasActions,
        headerActions,
        isOpen,
        isRelevant,
        name,
        onClick,
        onMouseEnter,
        onMouseLeave,
        text,
        theme = defaultTheme,
        variant,
        ...forwardedProps
    } = props;
    const hasChildren = Children.count(children) > 0;

    return (
        <div
            ref={ref}
            className={classNames(
                className,
                handleBasicClasses({
                    hasChildren: hasChildren && isOpen,
                    hasIndentedChildren: hasChildren && variant === CommentBlockVariant.indented,
                    hasLinearChildren: hasChildren && variant === CommentBlockVariant.linear,
                    isRelevant,
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
            {...forwardedProps}
        >
            <div className={`${CLASSNAME}__wrapper`}>
                <div className={`${CLASSNAME}__avatar`}>
                    <Avatar {...avatarProps} size={Size.m} onClick={onClick} />
                </div>

                <div className={`${CLASSNAME}__container`}>
                    <div className={`${CLASSNAME}__content`}>
                        <div className={`${CLASSNAME}__meta`}>
                            {name && (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                <span
                                    className={`${CLASSNAME}__name`}
                                    onClick={onClick}
                                    onMouseEnter={onMouseEnter}
                                    onMouseLeave={onMouseLeave}
                                >
                                    {name}
                                </span>
                            )}
                            {headerActions && <span className={`${CLASSNAME}__header-actions`}>{headerActions}</span>}
                        </div>

                        <div className={`${CLASSNAME}__text`}>{text}</div>
                        {date &&
                            (fullDate ? (
                                <Tooltip label={fullDate} placement="top">
                                    <span className={`${CLASSNAME}__date`}>{date}</span>
                                </Tooltip>
                            ) : (
                                <span className={`${CLASSNAME}__date`}>{date}</span>
                            ))}
                    </div>
                    {hasActions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
                </div>
            </div>
            {hasChildren && isOpen && <div className={`${CLASSNAME}__children`}>{children}</div>}
        </div>
    );
});
CommentBlock.displayName = COMPONENT_NAME;
CommentBlock.className = CLASSNAME;
CommentBlock.defaultProps = DEFAULT_PROPS;
