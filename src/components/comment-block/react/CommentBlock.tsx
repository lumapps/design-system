import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Avatar, Size, Theme } from 'LumX';
import { ENTER_KEY_CODE } from 'LumX/core/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { isFunction } from 'lodash';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ICommentBlockProps extends IGenericProps {
    /* Actions elements to be transcluded into the component */
    actions?: HTMLElement | ReactNode;
    /* The url of the avatar picture we want to display */
    avatar: string;
    /* Children elements to be transcluded into the component */
    children?: HTMLElement | ReactNode;
    /* Comment timestamp */
    date: string;
    /* Where the component has actions to display */
    hasActions?: boolean;
    /* Whether the component has children blocks to display */
    hasChildren?: boolean;
    /* Whether the children blocks are shown*/
    isOpen?: boolean;
    isRelevant?: boolean;
    /* Username display */
    name: string;
    /* Content to be displayed */
    text: HTMLElement | string;
    /* Component theme */
    theme?: Theme;
    /* Callback for the click event. */
    onClick?(): void;
    /* Callback for the mouseEnter event. */
    onMouseEnter?(): void;
    /* Callback for the mouseEnter event. */
    onMouseLeave?(): void;
}
type CommentBlockProps = ICommentBlockProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<CommentBlockProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}CommentBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    hasActions: false,
    hasChildren: false,
    isOpen: false,
    isRelevant: false,
    theme: Theme.light,
};
/////////////////////////////

/**
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const CommentBlock: React.FC<CommentBlockProps> = ({
    actions,
    avatar,
    children,
    date,
    hasActions,
    hasChildren = DEFAULT_PROPS.hasChildren,
    isOpen = DEFAULT_PROPS.isOpen,
    isRelevant = DEFAULT_PROPS.isRelevant,
    name,
    onClick,
    onMouseEnter,
    onMouseLeave,
    text,
    theme = DEFAULT_PROPS.theme,
}: CommentBlockProps): React.ReactElement => {
    const enterKeyPress = (evt: KeyboardEvent): void => {
        if (evt.keyCode === ENTER_KEY_CODE && isFunction(onClick)) {
            onClick();
        }
    };

    return (
        <div
            className={classNames(
                handleBasicClasses({
                    hasChildren: hasChildren && isOpen,
                    isRelevant,
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
        >
            <div className="lumx-comment-block__wrapper">
                <div className="lumx-comment-block__avatar">
                    <Avatar image={avatar} size={Size.m} />
                </div>

                <div className="lumx-comment-block__container">
                    <div className="lumx-comment-block__content">
                        <div className="lumx-comment-block__meta">
                            <span
                                className="lumx-comment-block__name"
                                onClick={onClick}
                                onKeyPress={enterKeyPress}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                role="button"
                                tabIndex={onClick ? 0 : -1}
                            >
                                {name}
                            </span>
                            {date && <span className="lumx-comment-block__date">{date}</span>}
                        </div>

                        <div className="lumx-comment-block__text">{text}</div>
                    </div>
                    {hasActions && <div className="lumx-comment-block__actions">{actions}</div>}
                </div>
            </div>

            {hasChildren && isOpen && <div className="lumx-comment-block__children">{children}</div>}
        </div>
    );
};
CommentBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, CommentBlock, CommentBlockProps };
