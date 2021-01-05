import { Alignment, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';
import { useRovingTabIndex } from '../../hooks/useRovingTabIndex';

export enum TabListLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

export enum TabListPosition {
    center = 'center',
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
export interface TabListProps extends GenericProps {
    /** ARIA label (purpose of the set of tabs). */
    ['aria-label']: string;
    /** Tab list. */
    children: ReactNode;
    /** Layout of the tabs in the list. */
    layout?: TabListLayout;
    /** Position of the tabs in the list (requires 'clustered' layout). */
    position?: TabListPosition;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TabList`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${CSS_PREFIX}-tabs`;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TabListProps> = {
    layout: TabListLayout.fixed,
    position: TabListPosition.left,
    theme: Theme.light,
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
export const TabList: Comp<TabListProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        'aria-label': ariaLabel,
        children,
        className,
        layout,
        position,
        theme,
        useCustomColors,
        ...forwardedProps
    } = props;
    const tabListRef = React.useRef(null);
    useRovingTabIndex({
        parentRef: tabListRef,
        elementSelector: '[role="tab"]',
        keepTabIndex: false,
        extraDependencies: [children],
    });

    return (
        <div
            ref={mergeRefs(ref, tabListRef)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
        >
            <div className={`${CLASSNAME}__links`} role="tablist" aria-label={ariaLabel}>
                {children}
            </div>
        </div>
    );
});
TabList.displayName = COMPONENT_NAME;
TabList.className = CLASSNAME;
TabList.defaultProps = DEFAULT_PROPS;
