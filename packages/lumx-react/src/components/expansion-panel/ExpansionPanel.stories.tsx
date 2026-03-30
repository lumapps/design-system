/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import { ExpansionPanel, ExpansionPanelProps, Text } from '@lumx/react';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/ExpansionPanel/Stories';

/** Stateful wrapper that manages isOpen per instance, enabling independent toggle per panel. */
function StatefulExpansionPanel({
    isOpen: initiallyOpen,
    toggleButtonProps = { label: 'Toggle' },
    children,
    ...props
}: ExpansionPanelProps) {
    const [isOpen, setOpen] = React.useState(initiallyOpen);
    return (
        <ExpansionPanel isOpen={isOpen} onToggleOpen={setOpen} toggleButtonProps={toggleButtonProps} {...props}>
            {children}
        </ExpansionPanel>
    );
}

const { meta, ...stories } = setup({
    component: ExpansionPanel,
    components: { Text, StatefulExpansionPanel },
    decorators: { withNestedProps },
});

export default {
    title: 'LumX components/expansion-panel/ExpansionPanel',
    ...meta,
};

export const Default = { ...stories.Default };
export const HasBackground = { ...stories.HasBackground };
export const HasHeaderDivider = { ...stories.HasHeaderDivider };
export const Nested = { ...stories.Nested };
export const HideChildren = { ...stories.HideChildren };
