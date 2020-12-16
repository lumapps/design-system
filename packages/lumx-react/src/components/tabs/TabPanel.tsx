import { useTabProviderContext } from '@lumx/react/components/tabs/state';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, handleBasicClasses } from '@lumx/react/utils';

import classNames from 'classnames';
import React, { forwardRef } from 'react';

/**
 * Defines the props of the component.
 */
export interface TabPanelProps extends GenericProps {
    /** The tab panel HTML id. */
    id?: string;
    /** Whether the tab is active or not. */
    isActive?: boolean;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TabPanel`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = `${CSS_PREFIX}-tab-panel`;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TabPanelProps> = {};

/**
 * TabPanel component.
 *
 * Implements WAI-ARIA `tabpanel` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TabPanel: Comp<TabPanelProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, id, className, isActive: propIsActive, ...forwardedProps } = props;

    const state = useTabProviderContext('tabPanel', id);
    const isActive = propIsActive || state?.isActive;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            id={state?.tabPanelId}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isActive }))}
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={state?.tabId}
        >
            {(!state?.isLazy || isActive) && children}
        </div>
    );
});
TabPanel.displayName = COMPONENT_NAME;
TabPanel.className = CLASSNAME;
TabPanel.defaultProps = DEFAULT_PROPS;
