/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import { ExpansionPanel, ExpansionPanelProps, Text } from '@lumx/react';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';

function useBaseProps({
    toggleButtonProps = { label: 'Toggle' },
    isOpen: initiallyOpen,
    ...args
}: Partial<ExpansionPanelProps>) {
    const [isOpen, setOpen] = React.useState(initiallyOpen);
    return { isOpen, toggleButtonProps, onToggleOpen: setOpen, ...args };
}

export default {
    title: 'LumX components/expansion-panel/ExpansionPanel',
    component: ExpansionPanel,
    args: {
        'toggleButtonProps.label': 'Toggle',
        children: (
            <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                content
            </Text>
        ),
        label: 'Label',
    },
    decorators: [withNestedProps()],
    render(args: ExpansionPanelProps) {
        return <ExpansionPanel {...useBaseProps(args)} />;
    },
};

/** Minimal expansion panel config */
export const Default = {};

/** hasBackground variant */
export const HasBackground = {
    args: {
        hasBackground: true,
    },
};

/** hasHeaderDivider variant */
export const HasHeaderDivider = {
    args: {
        isOpen: true,
        hasBackground: true,
        hasHeaderDivider: true,
    },
};

/** Nested expansion panels */
export const Nested = {
    args: {},
    render(args: ExpansionPanelProps) {
        return (
            <ExpansionPanel {...useBaseProps(args)}>
                <ExpansionPanel
                    label="Child 1"
                    hasBackground
                    className="lumx-spacing-margin-left-huge lumx-spacing-margin-bottom-big"
                    {...useBaseProps(args)}
                >
                    <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                        content child 1
                    </Text>
                </ExpansionPanel>

                <ExpansionPanel
                    label="Child 2"
                    hasBackground
                    className="lumx-spacing-margin-left-huge lumx-spacing-margin-bottom-big"
                    {...useBaseProps(args)}
                >
                    <Text as="p" typography="body1" color="dark-L2" className="lumx-spacing-padding-big">
                        content child 2
                    </Text>
                </ExpansionPanel>
            </ExpansionPanel>
        );
    },
};

/** Hide component instead of unmounting it */
export const HideChildren = {
    args: {
        hasBackground: true,
        closeMode: 'hide',
    },
};
