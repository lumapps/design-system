import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import { PostBlock, PostBlockProps } from './PostBlock';

const CLASSNAME = PostBlock.className as string;

const setup = (props: Partial<PostBlockProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const propsOverride: PostBlockProps = {
        title: 'Title',
        ...props,
    };
    render(<PostBlock {...propsOverride} />, { wrapper });
    const postBlock = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, postBlock };
};

describe(`<${PostBlock.displayName}>`, () => {
    describe('Props', () => {
        it('should render content elements', () => {
            setup({
                author: 'Author Name',
                meta: 'Metadata',
                text: 'Post content',
                tags: <span>Tags</span>,
                attachments: <span>Attachments</span>,
                actions: <button type="button">Action</button>,
            });

            expect(screen.getByText('Author Name')).toBeInTheDocument();
            expect(screen.getByText('Metadata')).toBeInTheDocument();
            expect(screen.getByText('Post content')).toBeInTheDocument();
            expect(screen.getByText('Tags')).toBeInTheDocument();
            expect(screen.getByText('Attachments')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });

        it('should render HTML text', () => {
            setup({ text: { __html: '<strong>Bold Text</strong>' } });
            const boldText = screen.getByText('Bold Text');
            expect(boldText).toBeInTheDocument();
            expect(boldText.tagName).toBe('STRONG');
        });

        it('should handle title click', () => {
            const onClick = vi.fn();
            setup({ title: 'Clickable Title', onClick });
            fireEvent.click(screen.getByText('Clickable Title'));
            expect(onClick).toHaveBeenCalled();
        });

        it('should render thumbnail', () => {
            const { postBlock } = setup({ thumbnailProps: { image: 'image.jpg', alt: 'Thumb' } });
            const thumbnail = postBlock?.querySelector('.lumx-thumbnail');
            expect(thumbnail).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'postBlock',
        forwardAttributes: 'postBlock',
        applyTheme: {
            affects: [{ element: 'postBlock' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
