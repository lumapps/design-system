import React from 'react';

/**
 * SB decorator adding a wrapping div around the story
 */
export const withWrapper = <E extends React.ElementType = 'div'>(
    props: Omit<React.ComponentProps<E>, 'children'>,
    as?: E,
) => {
    // eslint-disable-next-line react/display-name
    return (Story: any) => {
        const Wrapper = as || 'div';
        return (
            <Wrapper {...props}>
                <Story />
            </Wrapper>
        );
    };
};
