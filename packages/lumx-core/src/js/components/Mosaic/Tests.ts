import range from 'lodash/range';
import { getByClassName, queryAllByClassName, queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME as THUMBNAIL_CLASSNAME } from '../Thumbnail';

const CLASSNAME = 'lumx-mosaic';

const generateThumbnails = (count: number) =>
    range(1, count + 1).map((i) => ({
        image: `https://example.com/image${i}.png`,
        alt: '',
    }));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { thumbnails: [], ...propsOverride };
    const wrapper = render(props, options);

    const mosaic = getByClassName(document.body, CLASSNAME);
    const thumbnails = queryAllByClassName(mosaic, THUMBNAIL_CLASSNAME);
    const overlay = queryByClassName(mosaic, `${CLASSNAME}__overlay`);
    return { props, mosaic, thumbnails, overlay, wrapper };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('Mosaic core tests', () => {
        describe('Props', () => {
            it.each([1, 2, 3, 4])('should render %s thumbnail', (count) => {
                const { mosaic, thumbnails } = setup({ thumbnails: generateThumbnails(count) }, renderOptions);
                expect(mosaic).toHaveClass(`${CLASSNAME}--has-${count}-thumbnail${count > 1 ? 's' : ''}`);
                expect(thumbnails.length).toBe(count);
            });

            it('should render more than 4 thumbnails', () => {
                const { mosaic, thumbnails, overlay } = setup({ thumbnails: generateThumbnails(6) }, renderOptions);
                expect(mosaic).toHaveClass(`${CLASSNAME}--has-4-thumbnails`);
                expect(thumbnails.length).toBe(4);
                expect(overlay).toBeInTheDocument();
                expect(overlay).toHaveTextContent('+2');
            });
        });
    });
};
