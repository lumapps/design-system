import { Kind } from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

export const Default = {
    argTypes: {
        kind: getSelectArgType(Kind),
    },
};

/**
 * All `kind` variants
 */
export const AllKinds = {
    argTypes: { kind: { control: false } },
};
