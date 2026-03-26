import { Size } from '../../constants';
import { CommonRef, HasClassName, JSXElement } from '../../types';
import { classNames } from '../../utils';
import { IconProps } from '../Icon';

import { TABS_CLASSNAME } from './constants';

/**
 * Defines the props of the component.
 */
export interface TabProps extends HasClassName {
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
    label: string | JSXElement;
    /** Whether any tab in the list is disabled (used to block interaction). */
    isAnyDisabled?: boolean;
    /** Whether the tab should become active when it receives focus (automatic activation pattern). */
    shouldActivateOnFocus?: boolean;
    /** Focus event handler injected by TabList. */
    handleFocus?: (event: any) => void;
    /** Keypress event handler injected by TabList. */
    handleKeyPress?: (event: any) => void;
    /** Callback to activate this tab, injected by TabList. */
    changeToTab?: () => void;
    /** Tab index for roving tabindex management. */
    tabIndex?: number;
    /** ID applied to the tab button element (for aria-labelledby on the panel). */
    tabId?: string;
    /** ID of the associated tab panel (for aria-controls). */
    tabPanelId?: string;
    /** Icon component injected by the framework wrapper. */
    Icon: any;
    /** Text component injected by the framework wrapper. */
    Text: any;
    /** Forward ref to the underlying button element. */
    ref?: CommonRef;
}

export type TabPropsToOverride =
    | 'isAnyDisabled'
    | 'shouldActivateOnFocus'
    | 'changeToTab'
    | 'tabIndex'
    | 'tabId'
    | 'tabPanelId'
    | 'Icon'
    | 'Text';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Tab';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TabProps> = {};

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = `${TABS_CLASSNAME}__link`;
const { block } = classNames.bem(CLASSNAME);

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Tab = (props: TabProps) => {
    const {
        className,
        icon,
        iconProps = {},
        isAnyDisabled,
        id,
        isActive,
        label,
        handleFocus,
        handleKeyPress,
        tabIndex = -1,
        changeToTab,
        tabPanelId,
        shouldActivateOnFocus,
        tabId,
        Icon,
        Text,
        ref,
        ...forwardedProps
    } = props;

    const changeToCurrentTab = () => {
        if (isAnyDisabled) {
            return;
        }
        changeToTab?.();
    };

    const onFocus = (event: any) => {
        handleFocus?.(event);
        if (shouldActivateOnFocus) {
            changeToCurrentTab();
        }
    };

    const onKeyPress = (event: any) => {
        handleKeyPress?.(event);
        if (event.key !== 'Enter' || isAnyDisabled) {
            return;
        }
        changeToCurrentTab();
    };

    return (
        <button
            ref={ref}
            {...forwardedProps}
            type="button"
            id={tabId}
            className={classNames.join(
                className,
                block({
                    'is-active': isActive,
                    'is-disabled': isAnyDisabled,
                }),
            )}
            onClick={changeToCurrentTab}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            role="tab"
            tabIndex={isActive ? 0 : tabIndex}
            aria-disabled={isAnyDisabled}
            aria-selected={isActive}
            aria-controls={tabPanelId}
        >
            {icon && <Icon icon={icon} size={Size.xs} {...iconProps} />}
            {label && (
                <Text as="span" truncate>
                    {label}
                </Text>
            )}
        </button>
    );
};
