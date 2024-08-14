import React from 'react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { toNestedProps } from '@lumx/react/stories/decorators/withNestedProps';

import { ImageBlock, ImageBlockProps } from './ImageBlock';
import { FullFeatured } from './ImageBlock.stories';

const CLASSNAME = ImageBlock.className as string;

const setup = (props: Partial<ImageBlockProps> = {}) => {
    render(<ImageBlock {...(props as any)} />);
    const imageBlock = queryByClassName(document.body, CLASSNAME);
    return { props, imageBlock };
};

describe(`<${ImageBlock.displayName}>`, () => {
    it('should render caption elements', () => {
        const props = {
            ...toNestedProps(FullFeatured.args),
            titleProps: { className: 'custom-title-class' },
            descriptionProps: { className: 'custom-description-class' },
        };
        const { imageBlock } = setup(props);
        const wrapper = queryByClassName(imageBlock as HTMLElement, 'lumx-image-block__wrapper');
        expect(wrapper).toBeInTheDocument();

        const caption = queryByClassName(wrapper as HTMLElement, 'lumx-image-block__caption');
        expect(caption).toBeInTheDocument();

        const title = queryByClassName(caption as HTMLElement, 'lumx-image-block__title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass(props.titleProps.className);

        const description = queryByClassName(caption as HTMLElement, 'lumx-image-block__description');
        expect(description).toBeInTheDocument();
        expect(description).toHaveClass(props.descriptionProps.className);

        const tags = queryByClassName(wrapper as HTMLElement, 'lumx-image-block__tags');
        expect(tags).toBeInTheDocument();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'imageBlock',
        forwardAttributes: 'imageBlock',
    });
});
