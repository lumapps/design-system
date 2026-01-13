import { InputHelper, Kind } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    argTypes: {
        kind: getSelectArgType(Kind),
    },
    args: {
        ...InputHelper.defaultProps,
        children: 'Some helper text',
    },
};

/**
 * Default input helper
 */
export const Default = {};

/**
 * All `kind` variants
 */
export const AllKinds = {
    argTypes: { kind: { control: false } },
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'kind', options: withUndefined(Kind) },
            },
        }),
    ],
};
