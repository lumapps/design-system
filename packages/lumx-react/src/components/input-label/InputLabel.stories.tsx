import { Default, IsRequired, WithCustomTypography } from '@lumx/core/js/components/InputLabel/Stories';
import { InputLabel } from './InputLabel';

export default {
    title: 'LumX components/input-label/Input Label',
    component: InputLabel,
    args: {
        ...InputLabel.defaultProps,
        ...Default.args,
    },
    argTypes: Default.argTypes,
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
