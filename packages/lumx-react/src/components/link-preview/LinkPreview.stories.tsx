/* istanbul ignore file */
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { Size } from '..';
import { LinkPreview } from './LinkPreview';

export default { title: 'LumX components/link-preview/Link preview' };

const LONG_LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut quam sollicitudin, viverra quam eget, pretium tellus. Praesent sit amet augue in odio varius accumsan vitae quis nunc. Aliquam iaculis neque at augue laoreet, eu sagittis dolor tempus. Nullam sit amet bibendum velit, in pharetra lorem. Aliquam semper accumsan placerat. Sed felis risus, efficitur non eros non, rhoncus viverra lectus. Aliquam eget interdum tellus. Praesent non ex ut urna tempus facilisis. Sed tellus tortor, pharetra vel velit sit amet, aliquet condimentum quam. Sed dictum nibh eget nibh ullamcorper dignissim. Vestibulum elementum at mauris sit amet iaculis. Maecenas pretium luctus enim vel commodo. Cras accumsan sagittis eros, vel maximus sem molestie id. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Mauris ultrices pellentesque vestibulum. Etiam vel turpis at eros condimentum feugiat nec sit amet diam. Fusce pellentesque vulputate est sed ultrices. Etiam arcu tellus, dignissim non dui mattis, suscipit pellentesque erat. Aliquam congue magna nec varius suscipit. Sed mattis fringilla viverra. Donec pulvinar ex ac augue feugiat, a vulputate mauris suscipit. Morbi eget lorem purus. In pretium ligula non ex auctor, ornare dignissim orci dictum. Nulla ornare, risus non tincidunt blandit, massa massa mollis velit, id vulputate mi ligula ut metus. Vestibulum mattis tincidunt lorem, ac commodo felis ultricies interdum. Proin fermentum eu nibh a suscipit. Morbi eu pretium sapien. Pellentesque pretium purus eros, eget feugiat nisl dapibus at.`;

/**
 * LinkPreview story
 * @return regular LinkPreview.
 */
export const regularLinkPreview = ({ theme }: any) => (
    <LinkPreview
        title={text('Title', 'Link title')}
        description={text('Description', LONG_LOREM_IPSUM)}
        link={text('URL', 'https://google.com')}
        theme={theme}
        thumbnail={text('Image', 'https://loremflickr.com/320/240')}
    />
);

/**
 * LinkPreview story
 * @return regular LinkPreview without thumbnail.
 */
export const noThumbnail = ({ theme }: any) => (
    <LinkPreview
        title={text('Title', 'Link title')}
        description={text('Description', LONG_LOREM_IPSUM)}
        link={text('URL', 'https://google.com')}
        theme={theme}
    />
);

/**
 * LinkPreview story
 * @return regular LinkPreview without thumbnail, title and description.
 */
export const onlyUrl = ({ theme }: any) => <LinkPreview link={text('URL', 'https://google.com')} theme={theme} />;

/**
 * LinkPreview story
 * @return big LinkPreview.
 */
export const bigLinkPreview = ({ theme }: any) => {
    const wrapperStyle = { width: 400 };

    return (
        <div style={wrapperStyle}>
            <LinkPreview
                title={text('Title', 'Link title')}
                description={text('Description', LONG_LOREM_IPSUM)}
                link={text('URL', 'https://google.com')}
                theme={theme}
                thumbnail={text('Image', 'https://loremflickr.com/320/240')}
                size={Size.big}
            />
        </div>
    );
};

/**
 * LinkPreview story
 * @return big LinkPreview without thumbnail.
 */
export const bigWithoutThumbnail = ({ theme }: any) => {
    const wrapperStyle = { width: 400 };

    return (
        <div style={wrapperStyle}>
            <LinkPreview
                title={text('Title', 'Link title')}
                description={text('Description', LONG_LOREM_IPSUM)}
                link={text('URL', 'https://google.com')}
                theme={theme}
                size={Size.big}
            />
        </div>
    );
};

/**
 * LinkPreview story
 * @return big LinkPreview without thumbnail, title and descritpion.
 */
export const bigWithOnlyUrl = ({ theme }: any) => {
    const wrapperStyle = { width: 400 };

    return (
        <div style={wrapperStyle}>
            <LinkPreview link={text('URL', 'https://google.com')} theme={theme} size={Size.big} />
        </div>
    );
};
