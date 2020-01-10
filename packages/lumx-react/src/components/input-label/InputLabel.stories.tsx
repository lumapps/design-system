import { decorators } from '@lumx/react/story-block';
import { text } from '@storybook/addon-knobs';
import React from 'react';

import { InputLabel } from './InputLabel';

export default { title: 'Input Label', decorators };

export const simpleLabel = ({ theme }) => <InputLabel theme={theme}>{text('Label', 'The label')}</InputLabel>;
