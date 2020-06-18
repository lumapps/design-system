import React, { ReactElement, ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
interface ListItemContentProps {
    /** After content element */
    after?: ReactElement;

    /** Before content element. */
    before?: ReactElement;

    /** The base class name */
    baseClassName: string;

    /** List item content. */
    children: string | ReactNode;
}

/**
 * Component used in List element.
 *
 * @return The component.
 */
const ListItemContent: React.FC<ListItemContentProps> = ({ after, children, before, baseClassName }) => {
    return (
        <>
            {before && <div className={`${baseClassName}__before`}>{before}</div>}
            <div className={`${baseClassName}__content`}>{children}</div>
            {after && <div className={`${baseClassName}__after`}>{after}</div>}
        </>
    );
};

export { ListItemContent };
