import React from 'react';

import { WrappedDatePicker } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'DatePicker', decorators };

export const simpleDatePicker = ({ theme }) => {
    const [value, setValue] = React.useState();

    return <WrappedDatePicker locale="fr" label="Start date" theme={theme} onChange={setValue} value={value} />;
};
