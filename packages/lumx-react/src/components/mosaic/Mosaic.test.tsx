import React from 'react';

import { Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';
import { render, screen, within } from '@testing-library/react';
import { getByClassName, queryAllByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { Thumbnail } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import range from 'lodash/range';
import userEvent from '@testing-library/user-event';

const CLASSNAME = Mosaic.className as string;

const setup = (props: Partial<MosaicProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<Mosaic thumbnails={[]} {...props} />, { wrapper });
    const mosaic = getByClassName(document.body, CLASSNAME);
    const thumbnails = queryAllByClassName(mosaic, Thumbnail.className as string);
    const overlay = queryByClassName(mosaic, `${CLASSNAME}__overlay`);
    return { props, mosaic, thumbnails, overlay };
};

const generateThumbnails = (count: number) =>
    range(1, count + 1).map((i) => ({
        image: `https://example.com/image${i}.png`,
        alt: '',
    }));

describe(`<${Mosaic.displayName}>`, () => {
    it.each([1, 2, 3, 4])('should render %s thumbnail', async (count) => {
        const { mosaic, thumbnails } = setup({
            thumbnails: generateThumbnails(count),
        });
        expect(mosaic).toHaveClass(`${CLASSNAME}--has-${count}-thumbnail${count > 1 ? 's' : ''}`);
        expect(thumbnails.length).toBe(count);
        for (const thumbnail of thumbnails) {
            expect(within(thumbnail).queryByAltText('')).toBeInTheDocument();
        }
    });

    it('should render more than 4 thumbnails', () => {
        const { mosaic, thumbnails, overlay } = setup({
            thumbnails: generateThumbnails(6),
        });
        expect(mosaic).toHaveClass(`${CLASSNAME}--has-4-thumbnails`);
        expect(thumbnails.length).toBe(4);
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveTextContent('+2');
    });

    it('should render clickable', async () => {
        const onClick = vi.fn();
        const onImageClick = vi.fn();
        const { thumbnails } = setup({
            thumbnails: generateThumbnails(6),
            onImageClick,
            onClick,
        });

        expect(screen.queryAllByRole('button').length).toBe(thumbnails.length);

        // Click the third image
        await userEvent.click(thumbnails[2]);
        expect(onImageClick).toHaveBeenCalledWith(2);
        expect(onClick).toHaveBeenCalled();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'mosaic',
        forwardAttributes: 'mosaic',
        forwardRef: 'mosaic',
        applyTheme: {
            affects: [{ element: 'mosaic' }, { element: 'thumbnails' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
