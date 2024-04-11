import { Kind, Message } from '@lumx/react';
import { mdiDelete } from '@lumx/icons';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withNestedProps } from '../../stories/decorators/withNestedProps';

export default {
    title: 'LumX components/message/Message',
    component: Message,
    argTypes: {
        kind: getSelectArgType(Kind),
        hasBackground: { control: 'boolean' },
        icon: iconArgType,
    },
    args: { ...Message.defaultProps, children: loremIpsum('tiny') },
};

/**
 * Default message
 */
export const Default = {};

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...Default,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'kind', options: withUndefined(Kind) },
            },
        }),
    ],
};

/**
 * All `kind` variants with `hasBackground`
 */
export const AllKindsWithBackground = {
    ...AllKinds,
    args: {
        hasBackground: true,
    },
};

/**
 * With custom icon
 */
export const CustomIcon = {
    args: {
        icon: mdiDelete,
    },
};

/**
 * With close button (has background and kind info)
 */
export const ClosableMessage = {
    args: {
        'closeButtonProps.label': 'Close',
        hasBackground: true,
        kind: 'info',
    },
    argTypes: {
        'closeButtonProps.onClick': { action: true },
    },
    decorators: [withNestedProps()],
};
