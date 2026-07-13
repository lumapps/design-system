import { Size } from '../../constants';
import { CommonRef, ElementType, HasClassName, HasRequiredLinkHref, JSXElement } from '../../types';
import { classNames } from '../../utils';
import { IconProps } from '../Icon';
import { RawClickable } from '../RawClickable';

import { TABS_CLASSNAME } from './constants';

/**
 * Element a `Tab` can render as: `'button'` (default, classic tab), `'a'` (nav-link, `href`
 * required via {@link HasRequiredLinkHref}), or any `ElementType` (nav-link, e.g. a router `Link`).
 */
export type TabElement = 'a' | 'button' | ElementType;

/**
 * Defines the props of the component (independent of the `as` element).
 */
export interface CommonTabProps extends HasClassName {
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
    /**
     * WAI-ARIA `tab` role, resolved by the framework wrapper from `TabProvider` presence:
     * `'tab'` inside a provider (classic tab mode), `undefined` outside (nav-link mode).
     */
    role?: 'tab';
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
    /** Name of the prop used to set tab index (framework-dependent). */
    tabIndexProp?: string;
    /** Name of the prop used to attach the keypress event (framework-dependent). */
    keyPressProp?: string;
    /** ID of the associated tab panel (for aria-controls). */
    tabPanelId?: string;
    /** Icon component injected by the framework wrapper. */
    Icon: any;
    /** Text component injected by the framework wrapper. */
    Text: any;
    /** Forward ref to the underlying element. */
    ref?: CommonRef;
}

/**
 * Polymorphic `as` surface for `Tab`. Not `HasPolymorphicAs<E>`: core JSX is type-checked under
 * both the React and Vue namespaces, so spreading React DOM prop types would break the Vue
 * cross-check. `href` is required at compile time when `as === 'a'` (via {@link HasRequiredLinkHref}).
 */
export type TabAsProps<E extends TabElement = 'button'> = { as?: E } & (E extends 'a'
    ? HasRequiredLinkHref<'a'>
    : unknown);

/**
 * Props of the `Tab` component. Polymorphic on `as` (element selection only): `as` picks the
 * rendered element, while **mode is driven by `TabProvider` presence** (via the wrapper-resolved
 * `role`), not by `as`. The `href` conditional's false branch is `unknown` (not a record) to avoid
 * widening `keyof TabProps`.
 */
export type TabProps<E extends TabElement = 'button'> = CommonTabProps & TabAsProps<E>;

export type TabPropsToOverride =
    | 'as'
    | 'role'
    | 'isAnyDisabled'
    | 'shouldActivateOnFocus'
    | 'changeToTab'
    | 'tabIndex'
    | 'tabIndexProp'
    | 'keyPressProp'
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
 * Tab component. Two modes keyed on `TabProvider` presence (via the wrapper-resolved `role`):
 * tab mode (`role === 'tab'`, inside a provider) implements the WAI-ARIA `tab` role
 * {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label};
 * nav-link mode (no provider) renders plain link semantics (`aria-current`, no tab role/aria).
 * `as` only selects the rendered element and applies in both modes.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Tab = <E extends TabElement = 'button'>(props: TabProps<E>) => {
    const {
        as = 'button',
        className,
        icon,
        iconProps = {},
        isAnyDisabled,
        isDisabled,
        id,
        isActive,
        role,
        label,
        handleFocus,
        handleKeyPress,
        tabIndex = -1,
        tabIndexProp = 'tabIndex',
        keyPressProp = 'onKeyPress',
        changeToTab,
        tabPanelId,
        shouldActivateOnFocus,
        Icon,
        Text,
        ref,
        ...forwardedProps
    } = props;
    let rawClickableProps: Record<string, unknown>;

    if (role === 'tab') {
        // Mode: WAI-ARIA `tab` role (inside a TabProvider)
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
        rawClickableProps = {
            ...forwardedProps,
            'aria-disabled': isAnyDisabled ? 'true' : 'false',
            handleClick: changeToCurrentTab,
            onFocus,
            role: 'tab',
            'aria-selected': isActive,
            'aria-controls': tabPanelId,
            [keyPressProp]: onKeyPress,
            [tabIndexProp]: isActive ? 0 : tabIndex,
        };
    } else {
        // Mode: nav link
        const { onClick, ...rest } = forwardedProps as any;
        rawClickableProps = {
            ...rest,
            isDisabled,
            handleClick: onClick,
            'aria-current': isActive ? 'page' : undefined,
        };
    }

    return RawClickable({
        ...rawClickableProps,
        as,
        id,
        className: classNames.join(className, block({ 'is-active': isActive, 'is-disabled': isAnyDisabled })),
        ref: ref as CommonRef,
        children: (
            <>
                {icon && <Icon icon={icon} size={Size.xs} {...iconProps} />}
                {label && (
                    <Text as="span" truncate>
                        {label}
                    </Text>
                )}
            </>
        ),
    } as any);
};
