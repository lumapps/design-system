import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTabProviderContext } from '@lumx/react/components/tabs/state';
import { GenericProps } from '@lumx/react/utils/type';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    TabPanel as UI,
    TabPanelProps as UIProps,
    TabPanelPropsToOverride,
} from '@lumx/core/js/components/Tabs/TabPanel';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface TabPanelProps extends GenericProps, ReactToJSX<UIProps, TabPanelPropsToOverride> {
    /** Native id property */
    id?: string;
}

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
    const { id, isActive: propIsActive, ...forwardedProps } = props;

    const state = useTabProviderContext('tabPanel', id);
    const isActive = propIsActive || state?.isActive;

    return UI({
        ref,
        isActive,
        id: state?.tabPanelId,
        isLazy: state?.isLazy,
        tabId: state?.tabId,
        ...forwardedProps,
    });
});

TabPanel.displayName = COMPONENT_NAME;
TabPanel.className = CLASSNAME;
TabPanel.defaultProps = DEFAULT_PROPS;
