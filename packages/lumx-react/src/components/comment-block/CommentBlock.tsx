import React, { KeyboardEvent, KeyboardEventHandler, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, ENTER_KEY_CODE } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import isFunction from 'lodash/isFunction';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface CommentBlockProps extends GenericProps {
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

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<CommentBlockProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
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
    const enterKeyPress: KeyboardEventHandler<HTMLElement> = (evt: KeyboardEvent<HTMLElement>) => {
        if (evt.which === ENTER_KEY_CODE && isFunction(onClick)) {
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
            <div className={`${CLASSNAME}__wrapper`}>
                <div className={`${CLASSNAME}__avatar`}>
                    <Avatar
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
                        </div>

                        <div className={`${CLASSNAME}__text`}>{text}</div>
                    </div>
                    {hasActions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
                </div>
            </div>

            {hasChildren && isOpen && <div className={`${CLASSNAME}__children`}>{children}</div>}
        </div>
    );
};
CommentBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, CommentBlock, CommentBlockProps };
