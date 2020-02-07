import React from 'react';

import { text } from '@storybook/addon-knobs';

import { InputLabel } from './InputLabel';

export default { title: 'Input Label' };

export const simpleLabel = ({ theme }: any) => <InputLabel theme={theme}>{text('Label', 'The label')}</InputLabel>;
