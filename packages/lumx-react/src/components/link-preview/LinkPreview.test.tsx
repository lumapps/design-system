import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils/className';
import { Link, Thumbnail } from '@lumx/react';

import { Size, Theme } from '..';
import { LinkPreview, LinkPreviewProps } from './LinkPreview';

const DEFAULT_PROPS = LinkPreview.defaultProps as any;
const CLASSNAME = LinkPreview.className as string;

type SetupProps = Partial<LinkPreviewProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<LinkPreview {...props} />);

    return {
        thumbnail: wrapper.find(Thumbnail),
        title: wrapper.find(`.${CLASSNAME}__title`),
        description: wrapper.find(`.${CLASSNAME}__description`),
        link: wrapper.find(`.${CLASSNAME}__link`).find(Link),
        props,
        wrapper,
    };
};

describe(`<${LinkPreview.displayName}>`, () => {
    it('should render with default props', () => {
        const { wrapper, thumbnail, title, link, description } = setup();
        expect(wrapper).toHaveClassName(CLASSNAME);

        ['size', 'theme'].forEach((type) => {
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type, value: DEFAULT_PROPS[type] }));
        });
        expect(thumbnail).not.toExist();
        expect(title).not.toExist();
        expect(link).toExist();
        expect(link).toHaveProp('tabIndex', undefined);
        expect(description).not.toExist();
    });

    it('should render with only the title', () => {
        const { title, link } = setup({ title: 'Title' });

        expect(title).toExist();
        expect(link).toExist();
        expect(link).toHaveProp('tabIndex', '-1');
    });

    it('should render with complete props', () => {
        const { wrapper, thumbnail, title, link, description, props } = setup({
            size: Size.big,
            theme: Theme.dark,
            thumbnailProps: { image: 'https://example.com/thumbnail.jpg', alt: '' },
            link: 'https://example.com',
            linkProps: { 'data-custom-attr': 'true' },
            title: 'Title',
            description: 'Description',
        });

        const validateLink = (linkElement: any) => {
            expect(linkElement).toHaveProp('href', props.link);
            // Props forwarding
            expect(linkElement).toHaveProp('data-custom-attr', 'true');
        };

        expect(wrapper).toExist();

        // Thumbnail
        expect(thumbnail).toExist();
        validateLink((thumbnail as any).dive());

        // Title
        expect(title).toHaveText(props.title);
        validateLink(title.find(Link));

        // Link
        expect(link).toHaveText(props.link);
        validateLink(link.find(Link));

        // Description
        expect(description).toHaveText(props.description);

        // Size prop applied
        expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'size', value: props.size }));

        // Dark theme applied
        expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: Theme.dark }));
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
