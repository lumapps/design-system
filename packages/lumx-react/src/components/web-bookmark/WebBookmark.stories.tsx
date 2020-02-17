/* istanbul ignore file */
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { Size } from '..';
import { WebBookmark } from './WebBookmark';

export default { title: 'Web bookmark' };

const LONG_LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut quam sollicitudin, viverra quam eget, pretium tellus. Praesent sit amet augue in odio varius accumsan vitae quis nunc. Aliquam iaculis neque at augue laoreet, eu sagittis dolor tempus. Nullam sit amet bibendum velit, in pharetra lorem. Aliquam semper accumsan placerat. Sed felis risus, efficitur non eros non, rhoncus viverra lectus. Aliquam eget interdum tellus. Praesent non ex ut urna tempus facilisis. Sed tellus tortor, pharetra vel velit sit amet, aliquet condimentum quam. Sed dictum nibh eget nibh ullamcorper dignissim. Vestibulum elementum at mauris sit amet iaculis. Maecenas pretium luctus enim vel commodo. Cras accumsan sagittis eros, vel maximus sem molestie id. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Mauris ultrices pellentesque vestibulum. Etiam vel turpis at eros condimentum feugiat nec sit amet diam. Fusce pellentesque vulputate est sed ultrices. Etiam arcu tellus, dignissim non dui mattis, suscipit pellentesque erat. Aliquam congue magna nec varius suscipit. Sed mattis fringilla viverra. Donec pulvinar ex ac augue feugiat, a vulputate mauris suscipit. Morbi eget lorem purus. In pretium ligula non ex auctor, ornare dignissim orci dictum. Nulla ornare, risus non tincidunt blandit, massa massa mollis velit, id vulputate mi ligula ut metus. Vestibulum mattis tincidunt lorem, ac commodo felis ultricies interdum. Proin fermentum eu nibh a suscipit. Morbi eu pretium sapien. Pellentesque pretium purus eros, eget feugiat nisl dapibus at.`;

/**
 * WebBookmark story
 * @return simple WebBookmark.
 */
export const simpleWebBookmark = ({ theme }: any) => (
    <WebBookmark
        title={text('Title', 'Link title')}
        description={text('Description', LONG_LOREM_IPSUM)}
        url={text('URL', 'https://google.com')}
        theme={theme}
        thumbnail={text('Image', 'https://loremflickr.com/320/2400')}
    />
);

/**
 * WebBookmark story
 * @return simple WebBookmark.
 */
export const bigWebBookmark = ({ theme }: any) => (
    <WebBookmark
        size={Size.big}
        title={text('Title', 'Link title')}
        description={text('Description', LONG_LOREM_IPSUM)}
        url={text('URL', 'https://google.com')}
        theme={theme}
        thumbnail={text('Image', 'https://loremflickr.com/320/240')}
    />
);
