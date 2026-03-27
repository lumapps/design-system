import { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface TabPanelProps extends HasClassName {
    /** Whether the tab is active or not. */
    isActive?: boolean;
    /** Whether the tab is lazy loaded or not */
    isLazy?: boolean;
    /** Children */
    children?: JSXElement;
    /** ID applied to the tab button element (for aria-labelledby on the panel). */
    tabId?: string;
    /** ID of the associated tab panel (for aria-controls). */
    id?: string;
    /** Forward ref to the underlying button element. */
    ref?: CommonRef;
}

export type TabPanelPropsToOverride = 'tabId';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TabPanel';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = `lumx-tab-panel`;
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TabPanelProps> = {};

/**
 * TabPanel component.
 *
 * Implements WAI-ARIA `tabpanel` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TabPanel = (props: TabPanelProps) => {
    const { children, className, isActive, id, tabId, isLazy, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            id={id}
            className={classNames.join(className, block({ 'is-active': isActive }))}
            role="tabpanel"
            tabIndex={isActive ? 0 : -1}
            aria-labelledby={tabId}
        >
            {(!isLazy || isActive) && children}
        </div>
    );
};
