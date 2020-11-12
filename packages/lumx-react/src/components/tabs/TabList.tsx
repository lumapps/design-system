import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useRovingTabIndex } from '../../hooks/useRovingTabIndex';

enum TabListLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

enum TabListPosition {
    center = 'center',
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
interface TabListProps extends GenericProps {
    /** The label that describes the purpose of the set of tabs. */
    ['aria-label']: string;
    /** The children elements. */
    children: ReactNode;
    /** The layout of the tabs. */
    layout?: TabListLayout;
    /** The position of the tabs. */
    position?: TabListPosition;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TabList`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = `${CSS_PREFIX}-tabs`;

/**
 * The default value of props.
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
 * @return React element.
 */
const TabList: React.FC<TabListProps> = (props) => {
    const {
        ['aria-label']: ariaLabel,
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
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
            ref={tabListRef}
        >
            <div className={`${CLASSNAME}__links`} role="tablist" aria-label={ariaLabel}>
                {children}
            </div>
        </div>
    );
};
TabList.displayName = COMPONENT_NAME;
TabList.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, TabList, TabListProps, TabListLayout, TabListPosition };
