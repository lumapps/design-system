import React, { ReactElement, Ref } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface NotificationBlockProps extends GenericProps {
    /** After content element */
    after?: ReactElement;
    /** Before content element */
    before?: ReactElement;
    /** Date when the notification occurs */
    date?: string;
    /** Description message of the notification */
    description?: string;
    /** Title of the notification */
    title?: string;
    /** Reference passed to the wrapper. */
    notificationBlockRef?: Ref<HTMLDivElement>;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<NotificationBlockProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}NotificationBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    theme: Theme.light,
};

/**
 * Render a notification in a block.
 *
 * @return The component.
 */
const NotificationBlock: React.FC<NotificationBlockProps> = ({
    after,
    before,
    date,
    description,
    title,
    className,
    notificationBlockRef,
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            ref={notificationBlockRef}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={`${CLASSNAME}__content`}>
                <span className={`${CLASSNAME}__title`}>{title}</span>
                <p className={`${CLASSNAME}__description`}>{description}</p>
                <span className={`${CLASSNAME}__date`}>{date}</span>
            </div>

            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </div>
    );
};
NotificationBlock.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, NotificationBlock, NotificationBlockProps };
