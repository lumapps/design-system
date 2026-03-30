import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { DEFAULT_PROPS } from '.';

/**
 * Setup ExpansionPanel stories for a specific framework (React or Vue).
 * Framework-specific components (Text, StatefulExpansionPanel, etc.) are injected via `components`.
 * StatefulExpansionPanel is a framework-specific wrapper that manages isOpen state per instance,
 * enabling each panel to toggle independently.
 */
export function setup({
    component: ExpansionPanel,
    components: { Text, StatefulExpansionPanel },
    decorators: { withNestedProps },
}: SetupStoriesOptions<{
    decorators: 'withNestedProps';
    components: { Text: any; StatefulExpansionPanel: any };
}>) {
    const meta = {
        component: ExpansionPanel,
        render: ({ children, ...args }: any) => (
            <StatefulExpansionPanel {...args}>
                <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                    content
                </Text>
            </StatefulExpansionPanel>
        ),
        args: {
            ...DEFAULT_PROPS,
            'toggleButtonProps.label': 'Toggle',
            label: 'Label',
        },
        decorators: [withNestedProps()],
    };

    /** Minimal expansion panel config */
    const Default = {};

    /** hasBackground variant */
    const HasBackground = {
        args: {
            hasBackground: true,
        },
    };

    /** hasHeaderDivider variant */
    const HasHeaderDivider = {
        args: {
            isOpen: true,
            hasBackground: true,
            hasHeaderDivider: true,
        },
    };

    /** Nested expansion panels */
    const Nested = {
        args: {},
        render: ({ children, isOpen, ...args }: any) => (
            <StatefulExpansionPanel {...args} isOpen={isOpen}>
                <StatefulExpansionPanel
                    label="Child 1"
                    hasBackground
                    className="lumx-spacing-margin-left-huge lumx-spacing-margin-bottom-big"
                >
                    <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                        content child 1
                    </Text>
                </StatefulExpansionPanel>

                <StatefulExpansionPanel
                    label="Child 2"
                    hasBackground
                    className="lumx-spacing-margin-left-huge lumx-spacing-margin-bottom-big"
                >
                    <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                        content child 2
                    </Text>
                </StatefulExpansionPanel>
            </StatefulExpansionPanel>
        ),
    };

    /** Hide component instead of unmounting it */
    const HideChildren = {
        args: {
            hasBackground: true,
            closeMode: 'hide',
        },
    };

    return { meta, Default, HasBackground, HasHeaderDivider, Nested, HideChildren };
}
