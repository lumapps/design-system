import { h, isVNode, ref } from 'vue';
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
    onChangeProp = 'onChange',
    valueExtract = identity,
}: {
    valueProp?: string;
    valueTransform?: (v: any) => any;
    onChangeProp?: string;
    valueExtract?: (v: any) => any;
} = {}) => {
    return (story: any, ctx: any) => {
        const value = ref(ctx.args[valueProp]);
        const originalOnChange = ctx.args[onChangeProp];

        const onChange = (...callArgs: any[]) => {
            value.value = valueExtract(callArgs[0]);
            originalOnChange?.(...callArgs);
        };

        /** Inject the onChange handler into ctx.args before calling story(). */
        Object.assign(ctx.args, { [onChangeProp]: onChange });

        /**
         * Call story() to invoke the full inner decorator chain (e.g.
         * withCombinations). This preserves decorator structure and
         * performs Storybook bookkeeping.
         */
        const StoryComponent = story();

        /**
         * Determine the rendering strategy based on whether inner
         * decorators (like withCombinations) transformed the story output.
         *
         * ctx.originalStoryFn is the story's raw render function. When
         * the story has a custom render, calling it produces a VNode.
         * When it uses Storybook's default render, it returns a function.
         *
         * If story() (which runs through inner decorators) returns
         * something different from what the raw render produces, inner
         * decorators transformed the output. In that case, we must use
         * StoryComponent to preserve the decorator structure (e.g. a
         * combinations table from withCombinations).
         *
         * When no inner decorators exist and the story has a custom
         * render function, we re-invoke ctx.originalStoryFn in the
         * render function to produce fresh VNodes with the latest
         * reactive args (since render functions destructure args at
         * call time, freezing the initial values).
         *
         * When the story uses Storybook's default render (no custom
         * render), the StoryComponent already reads from reactive
         * ctx.args, so we just render it directly.
         */
        const renderFn = ctx.originalStoryFn;
        const rawRenderResult = renderFn(ctx.args, ctx);
        const hasCustomRender = typeof rawRenderResult !== 'function';
        /**
         * Inner decorators are present when story() returned something
         * different from the raw render - e.g. withCombinations wraps
         * the story render in a table component (returns a function),
         * while the raw render returns a VNode.
         */
        const hasInnerDecorators = hasCustomRender && typeof StoryComponent === 'function';
        const useDirectRender = hasCustomRender && !hasInnerDecorators;

        return () => {
            Object.assign(ctx.args, {
                [valueProp]: valueTransform(value.value),
                [onChangeProp]: onChange,
            });

            if (useDirectRender) {
                /**
                 * Re-invoke the story's render function with the latest
                 * reactive args to produce a fresh VNode tree.
                 */
                const result = renderFn(ctx.args, ctx);
                /**
                 * When the render function returns a component options object
                 * (e.g. from withRender: { components, setup, template })
                 * instead of a VNode, we need to mount it via h() since Vue
                 * render functions must return VNodes, not raw options objects.
                 */
                if (result && typeof result === 'object' && !isVNode(result)) {
                    return h(result);
                }
                return result;
            }

            /**
             * Use the StoryComponent from story() which preserves inner
             * decorator output and/or uses Storybook's default render
             * (which reads from reactive ctx.args).
             */
            return h(StoryComponent);
        };
    };
};
