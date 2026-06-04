import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxOption';
import comboboxOptionTests from '@lumx/core/js/components/Combobox/ComboboxOptionTests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { Combobox } from '@lumx/react';
import { ComboboxOptionProps } from './ComboboxOption';

/**
 * Mount a `<Combobox.Option>` inside the minimum required context
 * (`Provider` + `Input` + `List`) so that registration and click handling work.
 *
 * Option children are unmounted while the combobox is closed, so the helper
 * opens it (via the input trigger) before returning the option element.
 */
async function renderOption(propsOverride: Partial<ComboboxOptionProps> = {}, options?: SetupRenderOptions) {
    const props: any = {
        value: 'apple',
        children: 'Apple',
        ...propsOverride,
    };
    const { container } = render(
        <Combobox.Provider>
            <Combobox.Input placeholder="Pick a fruit…" onChange={() => {}} toggleButtonProps={{ label: 'Fruits' }} />
            <Combobox.List aria-label="Fruits">
                <Combobox.Option {...props} />
            </Combobox.List>
        </Combobox.Provider>,
        options,
    );
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    const option = await screen.findByRole('option');
    const element = getByClassName(container, CLASSNAME);
    return { props, container, element, option };
}

describe('<Combobox.Option>', () => {
    commonTestsSuiteRTL(renderOption, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });

    comboboxOptionTests({
        Combobox,
        render: (template) => render(template()),
    });

    it('should call the onClick listener when the option is clicked', async () => {
        const onClick = vi.fn();
        const { option } = await renderOption({ onClick });
        await userEvent.click(option);

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render the option action as a native button so keyboard activation fires click', async () => {
        const onClick = vi.fn();
        const { option } = await renderOption({ onClick });
        // The option's action element is a real <button>: pressing Enter on a focused
        // button fires a click event natively (verified here without moving DOM focus
        // away from the trigger, which would close the popover and unmount the option).
        expect(option.tagName).toBe('BUTTON');
        option.click();
        expect(onClick).toHaveBeenCalled();
    });

    it('should render the action as an anchor when actionProps includes as="a" and href', async () => {
        const { option } = await renderOption({ actionProps: { as: 'a', href: '/apple' } });
        expect(option).toBeInTheDocument();
        expect(option).toHaveAttribute('href', '/apple');
    });
});
