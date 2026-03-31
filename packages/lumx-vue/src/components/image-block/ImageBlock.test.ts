import { render, screen } from '@testing-library/vue';
import BaseImageBlockTests, { setup } from '@lumx/core/js/components/ImageBlock/Tests';
import { CLASSNAME } from '@lumx/core/js/components/ImageBlock';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ImageBlock } from '.';

describe('<ImageBlock />', () => {
    const renderImageBlock = (props: any, options?: SetupRenderOptions<any>) =>
        render(ImageBlock, { ...options, props });

    // Run core tests
    BaseImageBlockTests({
        render: renderImageBlock,
        screen,
    });

    const setupImageBlock = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const result = setup(props, { ...options, render: renderImageBlock, screen });
        const thumbnail = result.imageBlock?.querySelector('.lumx-thumbnail') ?? null;
        return { ...result, thumbnail };
    };

    describe('Vue', () => {
        it('should render tags slot', () => {
            render(ImageBlock, {
                props: { image: '/test.jpg', alt: 'Test' },
                slots: { tags: '<span>Tag content</span>' },
            });
            expect(screen.getByText('Tag content')).toBeInTheDocument();
        });

        it('should render actions slot', () => {
            render(ImageBlock, {
                props: { image: '/test.jpg', alt: 'Test' },
                slots: { actions: '<button>Action</button>' },
            });
            expect(screen.getByText('Action')).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupImageBlock, {
        baseClassName: CLASSNAME,
        forwardClassName: 'imageBlock',
        forwardAttributes: 'imageBlock',
        applyTheme: {
            affects: [{ element: 'imageBlock' }, { element: 'thumbnail' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
