import React from 'react';

import classNames from 'classnames';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTabProviderContext } from '@lumx/react/components/tabs/state';
import { CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';

/**
 * Defines the props of the component.
 */
export interface TabPanelProps extends GenericProps {
    /** Native id property */
    id?: string;
    /** Whether the tab is active or not. */
    isActive?: boolean;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TabPanel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${CSS_PREFIX}-tab-panel`;

/**
 * Component default props.
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
export const TabPanel = forwardRef<TabPanelProps, HTMLDivElement>((props, ref) => {
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
            tabIndex={isActive ? 0 : -1}
            aria-labelledby={state?.tabId}
        >
            {(!state?.isLazy || isActive) && children}
        </div>
    );
});
TabPanel.displayName = COMPONENT_NAME;
TabPanel.className = CLASSNAME;
TabPanel.defaultProps = DEFAULT_PROPS;
