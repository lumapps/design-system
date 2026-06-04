import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import { CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxOption';
import comboboxOptionTests from '@lumx/core/js/components/Combobox/ComboboxOptionTests';
import { findByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Combobox } from '.';
import ComboboxOption from './ComboboxOption';
import ComboboxProvider from './ComboboxProvider';
import ComboboxInput from './ComboboxInput';
import ComboboxList from './ComboboxList';

/**
 * Mount a `<Combobox.Option>` inside the minimum required context
 * (`Provider` + `Input` + `List`) so that registration and click handling work.
 *
 * Option children are unmounted while the combobox is closed, so the helper
 * opens it (via the input trigger) before returning the option element.
 */
async function renderOption(propsOverride: any = {}, options: SetupRenderOptions<any> = {}) {
    const { value = 'apple', ...rest } = propsOverride;
    const result = render(
        {
            setup: () => () => (
                <ComboboxProvider>
                    <ComboboxInput
                        placeholder="Pick a fruit…"
                        onChange={() => {}}
                        toggleButtonProps={{ label: 'Fruits' }}
                    />
                    <ComboboxList aria-label="Fruits">
                        <ComboboxOption value={value} {...rest}>
                            Apple
                        </ComboboxOption>
                    </ComboboxList>
                </ComboboxProvider>
            ),
        },
        options,
    );
    const input = screen.getByPlaceholderText('Pick a fruit…');
    await userEvent.click(input);
    const element = await findByClassName(document.body, CLASSNAME);
    const option = screen.getByRole('option');
    return { ...result, props: propsOverride, element, option };
}

describe('<Combobox.Option>', () => {
    commonTestsSuiteVTL(renderOption, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
    });

    comboboxOptionTests({
        Combobox,
        render: (template) => {
            const { unmount, container } = render({ setup: () => () => template() });
            return { unmount, container: container as HTMLElement };
        },
    });

    it('should call the @click listener when the option is clicked', async () => {
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
});
