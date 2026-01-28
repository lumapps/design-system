import { Button, ButtonProps } from '@lumx/vue';

import {
    Base as BaseStory,
    Default as DefaultStory,
} from '@lumx/core/js/components/Button/Stories';

export default {
    title: 'LumX components/button/Button',
    ...DefaultStory,
    component: Button,
};

/**
 * Default button
 */
export const Base = {
    ...BaseStory,
    render: (args: ButtonProps) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: `
            <Button v-bind="args" @click="args.onClick">
                {{ args.children }}
            </Button>
        `,
    }),
};
