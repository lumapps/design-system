import React from 'react';
import { render } from '@testing-library/react';
import identity from 'lodash/identity';
import over from 'lodash/over';

import listboxTests from '@lumx/core/js/components/Listbox/Tests';
import { IconButton } from '@lumx/react';
import { Listbox } from '.';

/**
 * Render a template with controlled state management.
 * Mirrors the withValueOnChange Storybook decorator.
 */
function renderWithState(
    template: (props: any) => React.JSX.Element,
    initialArgs: Record<string, any> = {},
    {
        onChangeProp = 'onChange',
        valueExtract = identity,
    }: { onChangeProp?: string; valueExtract?: (v: any) => any } = {},
) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? '');
        const props = {
            ...initialArgs,
            value,
            [onChangeProp]: over([(v: any) => setValue(valueExtract(v)), initialArgs[onChangeProp]]),
        };
        return template(props);
    };
    return render(<Wrapper />);
}

describe('<Listbox> (internal)', () => {
    listboxTests({ components: { Listbox, IconButton }, renderWithState });
});
