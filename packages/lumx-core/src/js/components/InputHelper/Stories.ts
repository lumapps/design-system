import { Kind } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

import { InputHelper } from '.';

export const Default = {
    argTypes: {
        kind: getSelectArgType(Kind),
    },
    args: { ...InputHelper.defaultProps },
};

/**
 * All `kind` variants
 */
export const AllKinds = {
    argTypes: { kind: { control: false } },
};
