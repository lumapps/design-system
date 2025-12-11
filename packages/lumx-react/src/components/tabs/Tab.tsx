import { FocusEventHandler, KeyboardEventHandler, ReactNode, useCallback } from 'react';

import classNames from 'classnames';

import { Icon, IconProps, Size, Text } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

import { useTabProviderContext } from './state';
import { TABS_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TabProps extends GenericProps {
    /** Children are not supported. */
    children?: never;
    /** Icon (SVG path). */
    icon?: IconProps['icon'];
    /** Icon component properties. */
    iconProps?: Omit<IconProps, 'icon'>;
    /** Native id property. */
    id?: string;
    /** Whether the tab is active or not. */
    isActive?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label content. */
    label: string | ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Tab';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${TABS_CLASSNAME}__link`;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TabProps> = {};

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Tab = forwardRef<TabProps, HTMLButtonElement>((props, ref) => {
    const { isAnyDisabled, otherProps } = useDisableStateProps(props);
    const {
        className,
        icon,
        iconProps = {},
        id,
        isActive: propIsActive,
        label,
        onFocus,
        onKeyPress,
        tabIndex = -1,
        ...forwardedProps
    } = otherProps;
    const state = useTabProviderContext('tab', id);
    const isActive = propIsActive || state?.isActive;

    const changeToCurrentTab = useCallback(() => {
        if (isAnyDisabled) {
            return;
        }
        state?.changeToTab();
    }, [isAnyDisabled, state]);

    const handleFocus: FocusEventHandler = useCallback(
        (event) => {
            onFocus?.(event);
            if (state?.shouldActivateOnFocus) {
                changeToCurrentTab();
            }
        },
        [changeToCurrentTab, onFocus, state?.shouldActivateOnFocus],
    );

    const handleKeyPress: KeyboardEventHandler = useCallback(
        (event) => {
            onKeyPress?.(event);
            if (event.key !== 'Enter' || isAnyDisabled) {
                return;
            }
            changeToCurrentTab();
        },
        [changeToCurrentTab, isAnyDisabled, onKeyPress],
    );

    return (
        <button
            ref={ref}
            {...forwardedProps}
            type="button"
            id={state?.tabId}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled: isAnyDisabled }),
            )}
            onClick={changeToCurrentTab}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            role="tab"
            tabIndex={isActive ? 0 : tabIndex}
            aria-disabled={isAnyDisabled}
            aria-selected={isActive}
            aria-controls={state?.tabPanelId}
        >
            {icon && <Icon icon={icon} size={Size.xs} {...iconProps} />}
            {label && (
                <Text as="span" truncate>
                    {label}
                </Text>
            )}
        </button>
    );
});
Tab.displayName = COMPONENT_NAME;
Tab.className = CLASSNAME;
Tab.defaultProps = DEFAULT_PROPS;
