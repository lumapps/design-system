import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useRovingTabIndex } from '../../hooks/useRovingTabIndex';
import { useTabProviderContextState } from '../tabs/state';

/**
 * Defines the props of the component.
 */
export interface ProgressTrackerProps extends GenericProps {
    /** ARIA label (purpose of the set of steps). */
    ['aria-label']: string;
    /** Step list. */
    children: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ProgressTracker';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ProgressTrackerProps> = {};

/**
 * ProgressTracker component.
 *
 * Implements WAI-ARIA `tablist` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ProgressTracker: Comp<ProgressTrackerProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { 'aria-label': ariaLabel, children, className, ...forwardedProps } = props;
    const stepListRef = React.useRef(null);
    useRovingTabIndex({
        parentRef: stepListRef,
        elementSelector: '[role="tab"]',
        keepTabIndex: false,
        extraDependencies: [children],
    });

    const state = useTabProviderContextState();
    const numberOfSteps = state?.ids?.tab?.length || 0;
    const backgroundPosition: number = numberOfSteps > 0 ? 100 / (numberOfSteps * 2) : 0;
    const trackPosition: number =
        numberOfSteps > 0 ? ((100 / (numberOfSteps - 1)) * (state?.activeTabIndex || 0)) / 100 : 0;

    return (
        <div
            ref={mergeRefs(ref, stepListRef)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
        >
            <div className={`${CLASSNAME}__steps`} role="tablist" aria-label={ariaLabel}>
                {children}
            </div>

            <div
                className={`${CLASSNAME}__background-bar`}
                style={{ left: `${backgroundPosition}%`, right: `${backgroundPosition}%` }}
            />

            <div
                className={`${CLASSNAME}__foreground-bar`}
                style={{
                    left: `${backgroundPosition}%`,
                    right: `${backgroundPosition}%`,
                    transform: `scaleX(${trackPosition})`,
                }}
            />
        </div>
    );
});
ProgressTracker.displayName = COMPONENT_NAME;
ProgressTracker.className = CLASSNAME;
ProgressTracker.defaultProps = DEFAULT_PROPS;
