import { Children, ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Emphasis, Icon, Size, IconButton, IconButtonProps } from '@lumx/react';
import { GenericProps, HasCloseMode, isComponent } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useId } from '@lumx/react/hooks/useId';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { RawClickable } from '@lumx/react/utils/react/RawClickable';

/**
 * Defines the props of the component.
 */
export interface SideNavigationItemProps extends GenericProps, HasCloseMode {
    /** SideNavigationItem elements. */
    children?: ReactNode;
    /** Emphasis variant. */
    emphasis?: Emphasis;
    /** Label content. */
    label: string | ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Props to pass to the link (minus those already set by the SideNavigationItem props). */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Props to pass to the toggle button (minus those already set by the SideNavigationItem props). */
    toggleButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color' | 'size'>;
    /** On action button click callback. */
    onActionClick?(evt: React.MouseEvent): void;
    /** On click callback. */
    onClick?(evt: React.MouseEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SideNavigationItem';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-side-navigation-item';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SideNavigationItemProps> = {
    emphasis: Emphasis.high,
    closeMode: 'unmount',
};

/**
 * SideNavigationItem component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SideNavigationItem = forwardRef<SideNavigationItemProps, HTMLLIElement>((props, ref) => {
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        icon,
        isOpen,
        isSelected,
        label,
        linkAs,
        linkProps,
        onActionClick,
        onClick,
        toggleButtonProps,
        closeMode = DEFAULT_PROPS.closeMode,
        ...forwardedProps
    } = props;

    const content = children && Children.toArray(children).filter(isComponent(SideNavigationItem));
    const hasContent = !isEmpty(content);
    const shouldSplitActions = Boolean(onActionClick);
    const showChildren = hasContent && isOpen;

    const contentId = useId();
    const ariaProps: any = {};
    if (hasContent) {
        ariaProps['aria-expanded'] = !!showChildren;
        // Associate with content ID only if in DOM (shown or hidden and not unmounted)
        ariaProps['aria-controls'] = showChildren || closeMode === 'hide' ? contentId : undefined;
    }

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    emphasis,
                    isOpen: showChildren,
                    isSelected,
                    prefix: CLASSNAME,
                }),
            )}
        >
            {shouldSplitActions ? (
                <div className={`${CLASSNAME}__wrapper`}>
                    <RawClickable
                        as={linkAs || (linkProps?.href ? 'a' : 'button')}
                        {...(linkProps as any)}
                        className={`${CLASSNAME}__link`}
                        onClick={onClick}
                    >
                        {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />}
                        <span>{label}</span>
                    </RawClickable>

                    <IconButton
                        {...toggleButtonProps}
                        className={`${CLASSNAME}__toggle`}
                        icon={isOpen ? mdiChevronUp : mdiChevronDown}
                        size={Size.m}
                        emphasis={Emphasis.low}
                        onClick={onActionClick}
                        {...ariaProps}
                    />
                </div>
            ) : (
                <RawClickable
                    as={linkAs || (linkProps?.href ? 'a' : 'button')}
                    {...linkProps}
                    className={`${CLASSNAME}__link`}
                    onClick={onClick}
                    {...ariaProps}
                >
                    {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.xs} />}
                    <span>{label}</span>
                    {hasContent && (
                        <Icon
                            className={`${CLASSNAME}__chevron`}
                            icon={isOpen ? mdiChevronUp : mdiChevronDown}
                            size={Size.xs}
                        />
                    )}
                </RawClickable>
            )}

            {(closeMode === 'hide' || showChildren) && (
                <ul className={`${CLASSNAME}__children`} id={contentId}>
                    {content}
                </ul>
            )}
        </li>
    );
});
SideNavigationItem.displayName = COMPONENT_NAME;
SideNavigationItem.className = CLASSNAME;
SideNavigationItem.defaultProps = DEFAULT_PROPS;
