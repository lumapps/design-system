/**
 * SB decorator adding a wrapping div around the story
 */
export const withWrapper = <E extends React.ElementType = 'div'>(
    props: Omit<React.ComponentProps<E>, 'children'>,
    as?: E,
) => {
    // eslint-disable-next-line react/display-name
    return (Story: any, ctx: any) => {
        const Wrapper = as || 'div';
        const { wrapperProps } = ctx.parameters;
        const overriddenProps = { ...props, ...wrapperProps, style: { ...props?.style, ...wrapperProps?.style } };
        return (
            <Wrapper {...overriddenProps}>
                <Story />
            </Wrapper>
        );
    };
};
