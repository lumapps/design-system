import { Icon, IconProps, Size } from '@lumx/react';
import { CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { FocusEventHandler, forwardRef, KeyboardEventHandler, ReactNode, useCallback } from 'react';
import { useTabProviderContext } from './state';

/**
 * Defines the props of the component.
 */
export interface TabProps extends GenericProps {
    /** Children are not supported. */
    children?: never;
    /** Icon (SVG path). */
    icon?: IconProps['icon'];
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
const CLASSNAME = `${CSS_PREFIX}-tabs__link`;

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
export const Tab: Comp<TabProps, HTMLButtonElement> = forwardRef((props, ref) => {
    const {
        className,
        disabled,
        icon,
        id,
        isActive: propIsActive,
        isDisabled = disabled,
        label,
        onFocus,
        onKeyPress,
        tabIndex = -1,
        ...forwardedProps
    } = props;
    const state = useTabProviderContext('tab', id);
    const isActive = propIsActive || state?.isActive;

    const changeToCurrentTab = useCallback(() => {
        if (isDisabled) {
            return;
        }
        state?.changeToTab();
    }, [isDisabled, state]);

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
            if (event.key !== 'Enter') {
                return;
            }
            changeToCurrentTab();
        },
        [changeToCurrentTab, onKeyPress],
    );

    return (
        <button
            ref={ref}
            {...forwardedProps}
            type="button"
            id={state?.tabId}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive, isDisabled }))}
            onClick={changeToCurrentTab}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            role="tab"
            tabIndex={isActive ? 0 : tabIndex}
            aria-disabled={isDisabled}
            aria-selected={isActive}
            aria-controls={state?.tabPanelId}
        >
            {icon && <Icon icon={icon} size={Size.xs} />}
            {label && <span>{label}</span>}
        </button>
    );
});
Tab.displayName = COMPONENT_NAME;
Tab.className = CLASSNAME;
Tab.defaultProps = DEFAULT_PROPS;
