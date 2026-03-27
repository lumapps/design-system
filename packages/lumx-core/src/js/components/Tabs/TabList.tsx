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
    /** ref to the wrapper element */
    ref?: CommonRef;
}

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
        theme,
        ref,
        ...forwardedProps
    } = props;

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
            <div className={element('links')} role="tablist" aria-label={ariaLabel}>
                {children}
            </div>
        </div>
    );
};
