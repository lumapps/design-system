import { Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';
import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { Thumbnail } from '@lumx/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import BaseMosaicTests from '@lumx/core/js/components/Mosaic/Tests';

const CLASSNAME = Mosaic.className as string;

const setup = (props: Partial<MosaicProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<Mosaic thumbnails={[]} {...props} />, { wrapper });
    const mosaic = getByClassName(document.body, CLASSNAME);
    const thumbnails = Array.from(mosaic.getElementsByClassName(Thumbnail.className as string)) as HTMLElement[];
    const overlay = mosaic.querySelector(`.${CLASSNAME}__overlay`) as HTMLElement | null;
    return { props, mosaic, thumbnails, overlay };
};

describe(`<${Mosaic.displayName}>`, () => {
    // Run core tests
    BaseMosaicTests({
        render: (props: MosaicProps) => render(<Mosaic {...props} />),
        screen,
    });

    describe('React', () => {
        it('should render clickable', async () => {
            const onClick = vi.fn();
            const onImageClick = vi.fn();
            const { thumbnails } = setup({
                thumbnails: Array.from({ length: 6 }, (_, i) => ({
                    image: `https://example.com/image${i + 1}.png`,
                    alt: '',
                })),
                onImageClick,
                onClick,
            });

            expect(screen.queryAllByRole('button').length).toBe(thumbnails.length);

            await userEvent.click(thumbnails[2]);
            expect(onImageClick).toHaveBeenCalledWith(2);
            expect(onClick).toHaveBeenCalled();
        });

        it('should trigger individual thumbnail onClick', async () => {
            const individualOnClick = vi.fn();
            const thumbnailsProps = Array.from({ length: 4 }, (_, i) => ({
                image: `https://example.com/image${i + 1}.png`,
                alt: '',
            }));
            (thumbnailsProps[0] as any).onClick = individualOnClick;

            const { thumbnails } = setup({ thumbnails: thumbnailsProps });

            await userEvent.click(thumbnails[0]);
            expect(individualOnClick).toHaveBeenCalled();
        });
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
