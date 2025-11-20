import { Typography } from '@lumx/react';

import { InputLabel } from './InputLabel';

export default {
    title: 'LumX components/input-label/Input Label',
    component: InputLabel,
    args: {
        ...InputLabel.defaultProps,
        children: 'Label text',
    },
    argTypes: {
        isRequired: { control: 'boolean' },
    },
    decorators: [
        /**
         * Associate label with an input
         */
        (Story: any, ctx: any) => (
            <>
                <input type="hidden" id="123" />
                <Story args={{ ...ctx.args, htmlFor: '123' }} />
            </>
        ),
    ],
};

/**
 * Default input label
 */
export const Default = {};

/**
 * Required input label
 */
export const IsRequired = {
    args: { isRequired: true },
};

/**
 * Default input label
 */
export const WithCustomTypography = {
    args: { typography: Typography.subtitle1 },
};
