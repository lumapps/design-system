import { classNames } from '../../utils';
import type { GenericProps, HasClassName, HasTheme, LumxClassName } from '../../types';
import type { TimeOfDay } from '../../utils/time';
import type { SelectTextFieldTranslations } from '../../utils/select/types';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TimePickerField';

/**
 * Component default class name (BEM root).
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-time-picker-field';
const { block } = classNames.bem(CLASSNAME);

/**
 * Translations consumed by `TimePickerField` (forwarded as-is to the underlying
 * `SelectTextField`).
 */
export type TimePickerFieldTranslations = Pick<SelectTextFieldTranslations, 'clearLabel' | 'showSuggestionsLabel'>;

/**
 * Core props for the `TimePickerField` template.
 */
export interface TimePickerFieldProps extends HasTheme, HasClassName, GenericProps {
    /**
     * Currently selected option. Resolve from the consumer's `Date` value via
     * `value && timeList.find((e) => e.hour === value.getHours() && e.minute === value.getMinutes())`.
     */
    value?: TimeOfDay;

    /** Time options (one entry per `step`-minute slot). */
    options: TimeOfDay[];

    /** Translation labels (clear button, show-suggestions toggle). */
    translations: TimePickerFieldTranslations;

    /** Called when the user picks (or clears) an option. */
    handleChange(next: TimeOfDay | undefined): void;

    /** Called as the user types — wrappers track this to resolve on blur. */
    handleSearch(typed: string): void;

    /** Called when the input loses focus — wrappers commit the typed value. */
    handleBlur(): void;
}

/**
 * Injected framework-specific components for TimePickerField rendering.
 */
export interface TimePickerFieldComponents {
    /** Framework-specific `SelectTextField` wrapper. */
    SelectTextField: any;
    /** Framework-specific `SelectTextField.Option` sub-component (used to render disabled out-of-range entries). */
    Option: any;
}

/**
 * `TimePickerField` core template.
 *
 * Renders a `SelectTextField<TimeOfDay>` with an option list built from
 * `buildTimeList`. Out-of-range options (strictly before `minTime` / after
 * `maxTime`) remain visible in the dropdown but are rendered as disabled.
 *
 * Framework-specific components are passed as a second argument by the
 * React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const TimePickerField = (
    props: TimePickerFieldProps,
    { SelectTextField, Option }: TimePickerFieldComponents,
) => {
    const { options, translations, className, handleChange, handleSearch, handleBlur, ...fowardedProps } = props;

    return (
        <SelectTextField
            {...fowardedProps}
            className={block([className])}
            selectionType="single"
            options={options}
            getOptionId="name"
            renderOption={(entry: TimeOfDay) => <Option isDisabled={entry.outOfRange} />}
            onChange={handleChange}
            onSearch={handleSearch}
            onBlur={handleBlur}
            filter="auto"
            translations={translations}
        />
    );
};

TimePickerField.displayName = COMPONENT_NAME;
TimePickerField.className = CLASSNAME;
