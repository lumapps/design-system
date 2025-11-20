import { ReactNode, Ref, SyntheticEvent, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { ListProps, Size } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { onEnterPressed, onButtonPressed } from '@lumx/core/js/utils';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { renderLink } from '@lumx/react/utils/react/renderLink';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { HasAriaDisabled } from '@lumx/react/utils/type/HasAriaDisabled';

export type ListItemSize = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface ListItemProps extends GenericProps, HasAriaDisabled {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** Content. */
    children: string | ReactNode;
    /** Whether the list item should be highlighted or not. */
    isHighlighted?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Whether link/button is disabled or not. */
    isDisabled?: boolean;
    /** Reference to the <li> element. */
    listItemRef?: Ref<HTMLLIElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Props that will be passed on to the Link */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Reference to the link element. */
    linkRef?: Ref<HTMLAnchorElement>;
    /** Size variant. */
    size?: ListItemSize;

    /** On selected callback. */
    onItemSelected?(evt: SyntheticEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ListProps> = {
    size: Size.regular,
};

/**
 * Check if the list item is clickable.
 * @return `true` if the list item is clickable; `false` otherwise.
 */
export function isClickable({ linkProps, onItemSelected }: Partial<ListItemProps>): boolean {
    return !isEmpty(linkProps?.href) || !!onItemSelected;
}

/**
 * ListItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListItem = forwardRef<ListItemProps, HTMLLIElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const {
        after,
        before,
        children,
        className,
        isHighlighted,
        isSelected,
        linkAs,
        linkProps = {},
        linkRef,
        onItemSelected,
        size = DEFAULT_PROPS.size,
        ...forwardedProps
    } = otherProps;

    const role = linkAs || linkProps.href ? 'link' : 'button';
    const onKeyDown = useMemo(() => {
        if (onItemSelected && role === 'link') return onEnterPressed(onItemSelected as any);
        if (onItemSelected && role === 'button') return onButtonPressed(onItemSelected as any);
        return undefined;
    }, [role, onItemSelected]);

    const content = (
        <>
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            <div className={`${CLASSNAME}__content`}>{children}</div>
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </>
    );

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    size,
                }),
            )}
        >
            {isClickable({ linkProps, onItemSelected }) ? (
                /* Clickable list item */
                renderLink(
                    {
                        linkAs,
                        tabIndex: !disabledStateProps.disabled ? 0 : undefined,
                        role,
                        'aria-disabled': isAnyDisabled,
                        ...linkProps,
                        href: isAnyDisabled ? undefined : linkProps.href,
                        className: classNames(
                            handleBasicClasses({
                                prefix: `${CLASSNAME}__link`,
                                isHighlighted,
                                isSelected,
                                isDisabled: isAnyDisabled,
                            }),
                        ),
                        onClick: isAnyDisabled ? undefined : onItemSelected,
                        onKeyDown: isAnyDisabled ? undefined : onKeyDown,
                        ref: linkRef,
                    },
                    content,
                )
            ) : (
                /* Non clickable list item */
                <div className={`${CLASSNAME}__wrapper`}>{content}</div>
            )}
        </li>
    );
});
ListItem.displayName = COMPONENT_NAME;
ListItem.className = CLASSNAME;
ListItem.defaultProps = DEFAULT_PROPS;
