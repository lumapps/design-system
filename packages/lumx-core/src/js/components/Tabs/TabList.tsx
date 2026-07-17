import { Alignment } from '../../constants';
import { CommonRef, HasClassName, HasTheme, JSXElement } from '../../types';
import { classNames } from '../../utils';

import { TABS_CLASSNAME as CLASSNAME } from './constants';

const { block, element } = classNames.bem(CLASSNAME);

export enum TabListLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

/**
 * Defines the props of the component.
 */
export interface TabListProps extends HasClassName, HasTheme {
    /** ARIA label (purpose of the set of tabs). */
    ['aria-label']: string;
    /** Tab list. */
    children: JSXElement;
    /** Layout of the tabs in the list. */
    layout?: TabListLayout;
    /** Position of the tabs in the list (requires 'clustered' layout). */
    position?: Alignment;
    /** `role` applied to the inner `__links` container */
    role?: 'navigation' | 'tablist';
    /** ref to the wrapper element */
    ref?: CommonRef;
}

export type TabListPropsToOverride =
    // `role` must be resolved by each framework wrapper
    'role';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TabList';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TabListProps> = {
    layout: TabListLayout.fixed,
    position: Alignment.left,
};

/**
 * TabList component.
 *
 * Implements WAI-ARIA `tablist` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TabList = (props: TabListProps) => {
    const {
        'aria-label': ariaLabel,
        children,
        className,
        layout = DEFAULT_PROPS.layout,
        position = DEFAULT_PROPS.position,
        role = 'tablist',
        theme,
        ref,
        ...forwardedProps
    } = props;
    const LinkWrapper = role === 'navigation' ? 'nav' : 'div';

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`layout-${layout}`]: Boolean(layout),
                    [`position-${position}`]: Boolean(position),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <LinkWrapper className={element('links')} role={role} aria-label={ariaLabel}>
                {children}
            </LinkWrapper>
        </div>
    );
};
