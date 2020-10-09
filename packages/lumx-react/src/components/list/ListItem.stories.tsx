import React from 'react';

import { Size } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';

import { ListItem } from './ListItem';

export default { title: 'LumX components/list/ListItem' };

export const Default = ({ theme }: any) => <ListItem theme={theme}>{text('text', 'Text')}</ListItem>;

export const Selected = ({ theme }: any) => (
    <ListItem theme={theme} linkProps={{ href: '#' }} isSelected>
        {text('text', 'Text')}
    </ListItem>
);

export const Highlighted = ({ theme }: any) => (
    <ListItem theme={theme} linkProps={{ href: '#' }} isHighlighted>
        {text('text', 'Text')}
    </ListItem>
);

export const Sizes = ({ theme }: any) => (
    <ListItem theme={theme} size={select('size', [Size.tiny, Size.regular, Size.big, Size.huge], Size.tiny)}>
        {text('text', 'Text')}
    </ListItem>
);

const CustomLink: React.FC = ({ children, ...props }) =>
    React.createElement('a', { ...props, style: { color: 'red' } }, children);

export const WithCustomLink = ({ theme }: any) => (
    <ListItem theme={theme} linkAs={CustomLink} linkProps={{ href: 'http://google.com' }}>
        My custom link
    </ListItem>
);
