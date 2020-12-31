import React, { Children, forwardRef, KeyboardEvent, KeyboardEventHandler, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';
import { AvatarProps } from '../avatar/Avatar';

/**
 * The authorized variants.
 */
export enum CommentBlockVariant {
    indented = 'indented',
    linear = 'linear',
}

/**
 * Defines the props of the component.
 */
export interface CommentBlockProps extends GenericProps {
    /** The action elements. */
    actions?: ReactNode;
    /**
     * The url of the avatar picture we want to display.
     * @see {@link AvatarProps#image}
     */
    avatar: string;
    /** The props to pass to the avatar, minus those already set by the CommentBlock props. */
    avatarProps?: Omit<AvatarProps, 'image' | 'size' | 'tabIndex' | 'onClick' | 'onKeyPress'>;
    /** The children elements. */
    children?: ReactNode;
    /** The timestamp of the component. */
    date: string;
    /** Whether the component has actions to display or not. */
    hasActions?: boolean;
    /** The title action elements. */
    headerActions?: ReactNode;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the comment is relevant or not. */
    isRelevant?: boolean;
    /** The name of the comment author. */
    name: string;
    /** The function called on click. */
    onClick?(): void;
    /** The function called when the cursor enters the component. */
    onMouseEnter?(): void;
    /** The function called when the cursor exists the component. */
    onMouseLeave?(): void;
    /** The content of the comment. */
    text: ReactNode | string;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The component variant. */
    variant?: CommentBlockVariant;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}CommentBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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
        avatar,
        avatarProps,
        children,
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
    } = props;
    const enterKeyPress: KeyboardEventHandler<HTMLElement> = (evt: KeyboardEvent<HTMLElement>) => {
        if (evt.which === ENTER_KEY_CODE && isFunction(onClick)) {
            onClick();
        }
    };
    const hasChildren = Children.count(children) > 0;

    return (
        <div
            ref={ref}
            className={classNames(
                handleBasicClasses({
                    hasChildren: hasChildren && isOpen,
                    hasIndentedChildren: hasChildren && variant === CommentBlockVariant.indented,
                    hasLinearChildren: hasChildren && variant === CommentBlockVariant.linear,
                    isRelevant,
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
        >
            <div className={`${CLASSNAME}__wrapper`}>
                <div className={`${CLASSNAME}__avatar`}>
                    <Avatar
                        {...avatarProps}
                        image={avatar}
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
