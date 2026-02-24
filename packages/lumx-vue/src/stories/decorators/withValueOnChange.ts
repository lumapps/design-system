import { h, ref } from 'vue';
import identity from 'lodash/identity';

/**
 * SB decorator managing a local reactive state for a value prop,
 * updating it via the onChange callback.
 *
 * This is the Vue equivalent of the React withValueOnChange decorator.
 */
export const withValueOnChange = ({
    valueProp = 'value',
    valueTransform = identity,
}: {
    valueProp?: string;
    valueTransform?: (v: any) => any;
} = {}) => {
    return (story: any, ctx: any) => {
        const value = ref(ctx.args[valueProp]);
        const originalOnChange = ctx.args.onChange;

        return () => {
            const args = {
                ...ctx.args,
                [valueProp]: valueTransform(value.value),
                onChange: (...callArgs: any[]) => {
                    value.value = callArgs[0];
                    originalOnChange?.(...callArgs);
                },
            };

            // Snapshot and restore ctx.args around the story() call to prevent
            // args from accumulating (same pattern as withCombinations).
            const savedArgs = ctx.args;
            ctx.args = { ...args };
            const StoryComponent = story({ args });
            ctx.args = savedArgs;

            return h(StoryComponent);
        };
    };
};
