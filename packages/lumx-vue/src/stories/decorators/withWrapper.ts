/**
 * SB decorator adding a wrapping div around the story
 */
export const withWrapper = (props: Record<string, any> = {}, as: string | object = 'div') => {
    return (story: any, context: any) => {
        const { wrapperProps } = context.parameters;
        const overriddenProps = { ...props, ...wrapperProps, style: { ...props?.style, ...wrapperProps?.style } };

        return {
            setup() {
                return { as, overriddenProps };
            },
            template: `
                <component :is="as" v-bind="overriddenProps">
                    <story />
                </component>
            `,
        };
    };
};
