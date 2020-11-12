import { TabState, useTabProviderContext, useTabProviderContextState } from './state';

export function setupTabProviderMocks(options: any = {}) {
    const changeToTab = jest.fn();
    const mockedHook = jest.fn(
        (): TabState => {
            const index = options.index || 0;
            const isLazy = options.isLazy as any;
            const shouldActivateOnFocus = options.shouldActivateOnFocus as any;
            const isActive = options.isActive || false;
            return {
                isLazy,
                shouldActivateOnFocus,
                changeToTab,
                tabId: `tab-${index}`,
                tabPanelId: `tab-panel-${index}`,
                isActive,
            };
        },
    );
    (useTabProviderContext as jest.Mock).mockImplementationOnce(mockedHook);

    const mockedHook2 = jest.fn((): any => {
        const index = options.index || 0;
        const numberOfSteps = options.numberOfSteps || 2;
        return {
            ids: { tab: { length: numberOfSteps } },
            activeTabIndex: index,
        };
    });
    (useTabProviderContextState as jest.Mock).mockImplementationOnce(mockedHook2);
    return { mockedHook, changeToTab };
}
