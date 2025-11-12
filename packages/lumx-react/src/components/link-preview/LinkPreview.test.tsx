import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { Size, Theme } from '@lumx/core/js/constants';
import { Thumbnail } from '@lumx/react';
import { render, screen, within } from '@testing-library/react';
import { getByClassName, queryByClassName, queryAllByClassName } from '@lumx/react/testing/utils/queries';

import { LinkPreview, LinkPreviewProps } from './LinkPreview';

const CLASSNAME = LinkPreview.className as string;

type SetupProps = Partial<LinkPreviewProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };

    render(<LinkPreview {...props} />, { wrapper });
    const linkPreview = getByClassName(document.body, CLASSNAME);
    const thumbnail = queryByClassName(linkPreview, Thumbnail.className as string);
    const title = queryByClassName(linkPreview, `${CLASSNAME}__title`);
    const description = queryByClassName(linkPreview, `${CLASSNAME}__description`);
    const link = queryAllByClassName(linkPreview, `${CLASSNAME}__link`)?.[1];

    return { props, linkPreview, thumbnail, title, description, link };
};

describe(`<${LinkPreview.displayName}>`, () => {
    it('should render with default props', () => {
        const { linkPreview, thumbnail, title, link, description } = setup();
        expect(linkPreview).toHaveClass(CLASSNAME);
        expect(linkPreview).toHaveClass(`${CLASSNAME}--size-regular`);
        expect(linkPreview).toHaveClass(`${CLASSNAME}--theme-light`);

        expect(thumbnail).not.toBeInTheDocument();
        expect(title).not.toBeInTheDocument();
        expect(link).toBeInTheDocument();
        expect(link).not.toHaveAttribute('tabindex');
        expect(description).not.toBeInTheDocument();
    });

    it('should render with only the title', () => {
        const { props, title, link } = setup({ title: 'Title', link: 'https://example.com' });

        expect(title).toBe(screen.queryByRole('heading', { name: props.title }));
        const titleLink = within(title as any).queryByRole('link');
        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAttribute('href', props.link);

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('tabindex', '-1');
    });

    it('should render with complete props', () => {
        const { linkPreview, thumbnail, title, link, description, props } = setup({
            size: Size.big,
            theme: Theme.dark,
            thumbnailProps: { image: 'https://example.com/thumbnail.jpg', alt: '' },
            link: 'https://example.com',
            linkProps: { 'data-custom-attr': 'true' },
            title: 'Title',
            description: 'Description',
        });

        const validateLink = (linkElement: any) => {
            expect(linkElement).toHaveAttribute('href', props.link);
            // Props forwarding
            expect(linkElement).toHaveAttribute('data-custom-attr', 'true');
        };

        expect(linkPreview).toBeInTheDocument();
        expect(linkPreview).toHaveClass(`${CLASSNAME}--size-big`);
        expect(linkPreview).toHaveClass(`${CLASSNAME}--theme-dark`);

        // Thumbnail
        expect(thumbnail).toBeInTheDocument();
        validateLink(thumbnail);

        // Title
        expect(title).toHaveTextContent(props.title);
        validateLink(within(title as any).queryByRole('link'));

        // Link
        expect(link).toHaveTextContent(props.link);
        validateLink(link);

        // Description
        expect(description).toHaveTextContent(props.description);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'linkPreview',
        forwardAttributes: 'linkPreview',
        forwardRef: 'linkPreview',
        applyTheme: {
            affects: [{ element: 'linkPreview' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
