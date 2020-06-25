import React from 'react';

import { ListSubheader } from '@lumx/react';
import { text } from '@storybook/addon-knobs';

export default { title: 'LumX components/List/ListSubheader' };

export const Default = () => <ListSubheader>{text('text', 'Text')}</ListSubheader>;
