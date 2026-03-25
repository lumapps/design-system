import React from 'react';
import { render } from '@testing-library/react';
import identity from 'lodash/identity';
import over from 'lodash/over';

import comboboxTests from '@lumx/core/js/components/Combobox/Tests';
import { Combobox, IconButton, Button } from '@lumx/react';

/**
 * Render a combobox template with controlled state management.
 * Mirrors the withValueOnChange Storybook decorator: manages a `value` state
 * and wires it through the specified change prop.
 *
 * @param template     JSX render function receiving { value, onChange/onSelect, ... }.
 * @param initialArgs  Initial props (value, spies, etc.).
 * @param options      State wiring config (which prop manages state, how to extract value).
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

describe('<Combobox>', () => {
    comboboxTests({
        components: { Combobox, IconButton, Button },
        renderWithState,
    });
});
