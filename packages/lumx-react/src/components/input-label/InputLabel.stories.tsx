import { setup } from '@lumx/core/js/components/InputLabel/Stories';

import { InputLabel } from './InputLabel';

const { meta, ...stories } = setup({
    component: InputLabel,
});

export default {
    title: 'LumX components/input-label/Input Label',
    ...meta,
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

export const Default = { ...stories.Default };
export const IsRequired = { ...stories.IsRequired };
export const WithCustomTypography = { ...stories.WithCustomTypography };
