import React from 'react';

import { DatePicker } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'DatePicker', decorators };

export const simpleDatePicker = () => <DatePicker locale="fr" />;
