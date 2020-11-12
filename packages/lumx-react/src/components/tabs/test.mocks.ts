import { TabState, useTabProviderContext } from './state';

jest.mock('./state', () => {
    return { useTabProviderContext: jest.fn() };
});

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
    return { mockedHook, changeToTab };
}
