import React, { Children, forwardRef, KeyboardEvent, KeyboardEventHandler, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, ValueOf } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';
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
export interface CommentBlockProps extends GenericProps {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Props to pass to the avatar. */
    avatarProps: AvatarProps;
    /** Comment block replies. */
    children?: ReactNode;
    /** Comment date. */
    date: string;
    /** Whether the component has actions to display or not. */
    hasActions?: boolean;
    /** Action toolbar header content. */
    headerActions?: ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the comment is relevant or not. */
    isRelevant?: boolean;
    /** Comment author name. */
    name: string;
    /** On click callback. */
    onClick?(): void;
    /** On mouse enter callback. */
    onMouseEnter?(): void;
    /** On mouse leave callback. */
    onMouseLeave?(): void;
    /** Comment content. */
    text: ReactNode | string;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
    theme: Theme.light,
    variant: CommentBlockVariant.indented,
};

/**
 * CommentBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const CommentBlock: Comp<CommentBlockProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        actions,
        avatarProps,
        children,
        className,
        date,
        hasActions,
        headerActions,
        isOpen,
        isRelevant,
        name,
        onClick,
        onMouseEnter,
        onMouseLeave,
        text,
        theme,
        variant,
        ...forwardedProps
    } = props;
    const enterKeyPress: KeyboardEventHandler<HTMLElement> = (evt: KeyboardEvent<HTMLElement>) => {
        if (evt.key === 'Enter' && isFunction(onClick)) {
            onClick();
        }
    };
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
                    <Avatar
                        {...avatarProps}
                        size={Size.m}
                        tabIndex={onClick ? 0 : -1}
                        onClick={onClick}
                        onKeyPress={enterKeyPress}
                    />
                </div>

                <div className={`${CLASSNAME}__container`}>
                    <div className={`${CLASSNAME}__content`}>
                        <div className={`${CLASSNAME}__meta`}>
                            <span
                                className={`${CLASSNAME}__name`}
                                onClick={onClick}
                                onKeyPress={enterKeyPress}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                role="button"
                                tabIndex={onClick ? 0 : -1}
                            >
                                {name}
                            </span>
                            {date && <span className={`${CLASSNAME}__date`}>{date}</span>}
                            {headerActions && <span className={`${CLASSNAME}__header-actions`}>{headerActions}</span>}
                        </div>

                        <div className={`${CLASSNAME}__text`}>{text}</div>
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
