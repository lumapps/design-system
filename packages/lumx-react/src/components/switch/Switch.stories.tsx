import { Alignment, Switch, SwitchProps } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

export default {
    title: 'LumX components/switch/Switch',
    component: Switch,
    args: {
        ...Switch.defaultProps,
        children: 'Switch label',
        name: 'switch-html-name',
        value: 'switch-html-value',
        isChecked: false,
    },
    argTypes: {
        position: getSelectArgType<SwitchProps['position']>([Alignment.left, Alignment.right]),
        onChange: { action: true },
    },
    decorators: [withValueOnChange({ valueProp: 'isChecked' })],
};

/**
 * Default switch
 */
export const Default = {};

/**
 * Switch disabled
 */
export const Disabled = {
    args: { isDisabled: true },
};

/**
 * Switch positioned to the right
 */
export const PositionRight = {
    args: { position: Alignment.right },
};
