import { getByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { Alignment } from '../../constants';
import { CLASSNAME, ImageBlockCaptionPosition } from '.';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { image: '/test.jpg', alt: 'Test image', ...propsOverride };
    const wrapper = render(props, options);

    const imageBlock = getByClassName(document.body, CLASSNAME);
    return { props, imageBlock, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('ImageBlock core tests', () => {
        describe('Props', () => {
            it('should apply align class', () => {
                const { imageBlock } = setup({ align: Alignment.right }, renderOptions);
                expect(imageBlock).toHaveClass(`${CLASSNAME}--align-right`);
            });

            it('should apply size class', () => {
                const { imageBlock } = setup({ size: 'xl' }, renderOptions);
                expect(imageBlock).toHaveClass(`${CLASSNAME}--size-xl`);
            });

            it('should apply fillHeight class', () => {
                const { imageBlock } = setup({ fillHeight: true }, renderOptions);
                expect(imageBlock).toHaveClass(`${CLASSNAME}--fill-height`);
            });

            it('should apply caption position class', () => {
                const { imageBlock } = setup({ captionPosition: ImageBlockCaptionPosition.over }, renderOptions);
                expect(imageBlock).toHaveClass(`${CLASSNAME}--caption-position-over`);
            });
        });
    });
};
