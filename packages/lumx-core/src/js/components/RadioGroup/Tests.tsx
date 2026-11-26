import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { getByClassName } from '../../../testing/queries';
import { CLASSNAME } from '.';

/** Components used by the radio group tests. */
export interface RadioGroupComponents {
    RadioGroup: any;
    RadioButton: any;
}

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the radio group test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface RadioGroupTestSetup {
    components: RadioGroupComponents;
    /**
     * Render a template with controlled state management (one `value` state, set by the
     * `onChangeProp` callback). Mirrors the withValueOnChange Storybook decorator.
     */
    renderWithState: (
        template: (props: any) => any,
        initialArgs?: Record<string, any>,
        options?: { onChangeProp?: string; valueExtract?: (v: any) => any },
    ) => RenderResult;
}

export default function radioGroupTests({ components, renderWithState }: RadioGroupTestSetup) {
    const { RadioGroup, RadioButton } = components;

    describe('Checked state', () => {
        it('checks the radio of the group value, and no other', () => {
            renderWithState(() => (
                <RadioGroup value="b" name="fruit">
                    <RadioButton label="A" value="a" />
                    <RadioButton label="B" value="b" />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
        });

        it('keeps the radio isChecked when the group has no value', () => {
            renderWithState(() => (
                <RadioGroup name="fruit">
                    <RadioButton label="A" value="a" isChecked />
                    <RadioButton label="B" value="b" />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).not.toBeChecked();
        });

        it('lets a radio isChecked win over a matching group value', () => {
            renderWithState(() => (
                <RadioGroup value="a" name="fruit">
                    <RadioButton label="A" value="a" isChecked={false} />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
        });

        it('leaves every radio unchecked when the group value matches no radio', () => {
            renderWithState(() => (
                <RadioGroup value="c" name="fruit">
                    <RadioButton label="A" value="a" />
                    <RadioButton label="B" value="b" />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).not.toBeChecked();
        });

        it('lets a radio checked win over a matching group value', () => {
            renderWithState(() => (
                <RadioGroup value="a" name="fruit">
                    <RadioButton label="A" value="a" checked={false} />
                    <RadioButton label="B" value="b" checked />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
        });

        it('leaves a radio outside a group unchanged', () => {
            renderWithState(() => <RadioButton label="A" value="a" isChecked />);
            expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
        });
    });

    describe('Name', () => {
        it('gives every radio input the group name', () => {
            renderWithState(() => (
                <RadioGroup name="fruit">
                    <RadioButton label="A" value="a" />
                    <RadioButton label="B" value="b" />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('name', 'fruit');
            expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('name', 'fruit');
        });

        it('shares one generated name across the radios when the group has no name', () => {
            renderWithState(() => (
                <RadioGroup>
                    <RadioButton label="A" value="a" />
                    <RadioButton label="B" value="b" />
                </RadioGroup>
            ));
            const nameA = screen.getByRole('radio', { name: 'A' }).getAttribute('name');
            const nameB = screen.getByRole('radio', { name: 'B' }).getAttribute('name');
            expect(nameA).toBeTruthy();
            expect(nameA).toBe(nameB);
        });

        it('lets a radio name win over the group name', () => {
            renderWithState(() => (
                <RadioGroup name="fruit">
                    <RadioButton label="A" value="a" name="custom" />
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('name', 'custom');
        });
    });

    describe('Change', () => {
        it('calls the group change once with (value, name, event), then checks the clicked radio', async () => {
            const onChange = vi.fn();
            renderWithState(
                (props: any) => (
                    <RadioGroup name="fruit" {...props}>
                        <RadioButton label="A" value="a" />
                        <RadioButton label="B" value="b" />
                    </RadioGroup>
                ),
                { onChange },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'B' }));
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith('b', 'fruit', expect.anything());
            expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
        });

        it('calls the radio change first, then the group change', async () => {
            const onRadioChange = vi.fn();
            const onChange = vi.fn();
            renderWithState(
                (props: any) => (
                    <RadioGroup name="fruit" {...props}>
                        <RadioButton label="A" value="a" onChange={onRadioChange} />
                    </RadioGroup>
                ),
                { onChange },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'A' }));
            expect(onRadioChange).toHaveBeenCalledTimes(1);
            expect(onRadioChange).toHaveBeenCalledWith('a', 'fruit', expect.anything());
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onRadioChange.mock.invocationCallOrder[0]).toBeLessThan(onChange.mock.invocationCallOrder[0]);
        });

        it('unchecks every radio when the app clears the group value', async () => {
            renderWithState(
                (props: any) => (
                    <>
                        <RadioGroup name="fruit" value={props.value} onChange={props.onChange}>
                            <RadioButton label="A" value="a" />
                            <RadioButton label="B" value="b" />
                        </RadioGroup>
                        <button type="button" onClick={() => props.onChange(undefined)}>
                            Clear
                        </button>
                    </>
                ),
                { value: 'a' },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'B' }));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();

            await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
            expect(screen.getByRole('radio', { name: 'A' })).not.toBeChecked();
            expect(screen.getByRole('radio', { name: 'B' })).not.toBeChecked();
        });

        it('does not call the group change for a radio with no value', async () => {
            const onRadioChange = vi.fn();
            const onChange = vi.fn();
            renderWithState(
                (props: any) => (
                    <RadioGroup name="fruit" {...props}>
                        <RadioButton label="A" onChange={onRadioChange} />
                    </RadioGroup>
                ),
                { onChange },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'A' }));
            expect(onRadioChange).toHaveBeenCalledTimes(1);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('does not call the group change when a disabled radio is clicked', async () => {
            const onChange = vi.fn();
            renderWithState(
                (props: any) => (
                    <RadioGroup name="fruit" {...props}>
                        <RadioButton label="A" value="a" isDisabled />
                    </RadioGroup>
                ),
                { onChange },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'A' }));
            expect(onChange).not.toHaveBeenCalled();
        });

        it('does not call the group change when an aria-disabled radio is clicked', async () => {
            const onChange = vi.fn();
            renderWithState(
                (props: any) => (
                    <RadioGroup name="fruit" {...props}>
                        <RadioButton label="A" value="a" aria-disabled />
                    </RadioGroup>
                ),
                { onChange },
            );
            await userEvent.click(screen.getByRole('radio', { name: 'A' }));
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('Nesting', () => {
        it('keeps a nested group independent: the nearest group wins', () => {
            renderWithState(() => (
                <RadioGroup value="outer" name="outer-group">
                    <RadioButton label="Outer" value="outer" />
                    <RadioGroup value="inner" name="inner-group">
                        <RadioButton label="Inner" value="inner" />
                    </RadioGroup>
                </RadioGroup>
            ));
            expect(screen.getByRole('radio', { name: 'Outer' })).toBeChecked();
            expect(screen.getByRole('radio', { name: 'Outer' })).toHaveAttribute('name', 'outer-group');
            expect(screen.getByRole('radio', { name: 'Inner' })).toBeChecked();
            expect(screen.getByRole('radio', { name: 'Inner' })).toHaveAttribute('name', 'inner-group');
        });
    });

    describe('Root element', () => {
        it('keeps value, name and onchange off the group root element', () => {
            const { container } = renderWithState(() => (
                <RadioGroup value="a" name="fruit" onChange={() => {}}>
                    <RadioButton label="A" value="a" />
                </RadioGroup>
            ));
            const root = getByClassName(container, CLASSNAME);
            expect(root).not.toHaveAttribute('value');
            expect(root).not.toHaveAttribute('name');
            expect(root).not.toHaveAttribute('onchange');
        });
    });
}
