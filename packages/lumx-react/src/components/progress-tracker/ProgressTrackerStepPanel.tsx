import React from 'react';

import classNames from 'classnames';

import { useTabProviderContext } from '@lumx/react/components/tabs/state';
import { CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ProgressTrackerStepPanelProps extends GenericProps {
    /** Native id property. */
    id?: string;
    /** Whether the step is active or not. */
    isActive?: boolean;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressTrackerStepPanel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = `${CSS_PREFIX}-step-panel`;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerStepPanelProps> = {};

/**
 * ProgressTrackerStepPanel component.
 *
 * Implements WAI-ARIA `tabpanel` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressTrackerStepPanel = forwardRef<ProgressTrackerStepPanelProps, HTMLDivElement>((props, ref) => {
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
ProgressTrackerStepPanel.displayName = COMPONENT_NAME;
ProgressTrackerStepPanel.className = CLASSNAME;
ProgressTrackerStepPanel.defaultProps = DEFAULT_PROPS;
