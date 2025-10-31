import { Kind } from '@lumx/react';

import InputHelper from './InputHelper.vue';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    argTypes: {
        kind: {
            control: { type: 'select' },
            options: Object.values(Kind),
        },
    },
    args: {
        helper: 'Some helper text',
        kind: undefined,
    },
};

/**
 * Default input helper
 */
export const Default = (args) => ({
    components: { InputHelper },
    setup() {
        return { args };
    },
    template: `
        <InputHelper v-bind="args">
            {{ args.helper }}
        </InputHelper>
    `,
});

/**
 * All `kind` variants
 */
export const AllKinds = () => ({
    components: { InputHelper },
    data() {
        return {
            kinds: [undefined, ...Object.values(Kind)],
        };
    },
    template: `
        <div>
            <div v-for="kind in kinds" :key="kind">
                <InputHelper :kind="kind">
                    Some helper text
                </InputHelper>
            </div>
        </div>
    `,
});
