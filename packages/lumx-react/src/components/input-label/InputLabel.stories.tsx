import { setup } from '@lumx/core/js/components/InputLabel/Stories';

import { InputLabel } from './InputLabel';

const { meta, Default, IsRequired, WithCustomTypography } = setup({
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

export { Default, IsRequired, WithCustomTypography };
