import type { HasClassName, HasTheme, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { getCurrentLocale } from '../../utils/locale/getCurrentLocale';
import { buildTimeList, type TimeOfDay } from '../../utils/time';
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
 *
 * The wrapper layer (React or Vue) is responsible for managing the typed-input
 * state and converting the picked `TimeOfDay` ↔ `Date` (via `getTime` and
 * `resolveTypedTimeChange`).
 *
 * Any additional prop (e.g. `name`, `placeholder`, `isRequired`, `helper`,
 * `error`, `id`, …) is forwarded as-is to the underlying `SelectTextField`
 * via the rest spread on the wrapper side.
 */
export interface TimePickerFieldProps extends HasTheme, HasClassName {
    /** Field label. */
    label: JSXElement;

    /**
     * Currently selected option. Resolve from the consumer's `Date` value via
     * `value && timeList.find((e) => e.hour === value.getHours() && e.minute === value.getMinutes())`.
     */
    value?: TimeOfDay;

    /** Pre-built time list (one entry per `step`-minute slot). */
    timeList: TimeOfDay[];

    /** Translation labels (clear button, show-suggestions toggle). */
    translations: TimePickerFieldTranslations;

    /** Called when the user picks (or clears) an option. */
    onChange(next: TimeOfDay | undefined): void;

    /** Called as the user types — wrappers track this to resolve on blur. */
    onSearch(typed: string): void;

    /** Called when the input loses focus — wrappers commit the typed value. */
    onBlur(): void;

    /** Extra props forwarded to the underlying `SelectTextField` (e.g. `name`, `helper`, …). */
    extraProps?: Record<string, any>;
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
 * Free-form typed input parsing is delegated to `resolveTypedTimeChange` and
 * lives in the framework wrappers (which hold the typed-value state).
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
    const { label, value, timeList, translations, className, theme, onChange, onSearch, onBlur, extraProps } = props;

    return (
        <SelectTextField
            {...extraProps}
            className={block([className])}
            selectionType="single"
            label={label}
            value={value}
            options={timeList}
            getOptionId="id"
            getOptionName="name"
            renderOption={(entry: TimeOfDay) => <Option isDisabled={entry.outOfRange} />}
            onChange={onChange}
            onSearch={onSearch}
            onBlur={onBlur}
            filter="auto"
            theme={theme}
            translations={translations}
        />
    );
};

TimePickerField.displayName = COMPONENT_NAME;
TimePickerField.className = CLASSNAME;

// Re-exports for wrapper convenience.
export { buildTimeList, getCurrentLocale };
