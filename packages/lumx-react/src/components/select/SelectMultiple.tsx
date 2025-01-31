import { ReactNode, RefObject, SyntheticEvent } from 'react';

import classNames from 'classnames';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMenuDown } from '@lumx/icons';
import { Size, Theme } from '@lumx/core/js/constants';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Icon } from '@lumx/react/components/icon/Icon';
import { InputLabel } from '@lumx/react/components/input-label/InputLabel';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { WithSelectContext } from './WithSelectContext';
import { CoreSelectProps, SelectVariant } from './constants';

/** Defines the props of the component. */
export interface SelectMultipleProps extends CoreSelectProps {
    /** Selected values. */
    value: string[];
    /** Selected value render function. Default: Renders the value inside of a Chip. */
    selectedChipRender?(
        choice: string,
        index: number,
        onClear?: (event: SyntheticEvent, choice: string) => void,
        isDisabled?: boolean,
        theme?: any,
    ): ReactNode | string;
}

/** The display name of the component. */
const COMPONENT_NAME = 'Select';

/** The default class name and classes prefix for this component. */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-select';

/** The default value of props. */
const DEFAULT_PROPS: Partial<SelectMultipleProps> = {
    selectedChipRender(choice, index, onClear, isDisabled?, theme?) {
        const onClick = (event: React.MouseEvent) => onClear && onClear(event, choice);
        return (
            <Chip
                key={index}
                after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
                isDisabled={isDisabled}
                size={Size.s}
                onAfterClick={onClick}
                onClick={onClick}
                theme={theme}
            >
                {choice}
            </Chip>
        );
    },
    selectedValueRender: (choice) => choice,
    variant: SelectVariant.input,
};

export const SelectMultipleField: React.FC<SelectMultipleProps> = (props) => {
    const defaultTheme = useTheme();
    const {
        anchorRef,
        handleKeyboardNav,
        hasError,
        icon,
        id,
        isDisabled,
        isEmpty,
        isRequired,
        isValid,
        label,
        onClear,
        onInputClick,
        placeholder,
        selectedChipRender,
        selectedValueRender,
        theme = defaultTheme,
        value,
        variant,
        selectElementRef,
        ...forwardedProps
    } = props;

    return (
        <>
            {variant === SelectVariant.input && (
                <>
                    {label && (
                        <div className={`${CLASSNAME}__header`}>
                            <InputLabel
                                htmlFor={id}
                                className={`${CLASSNAME}__label`}
                                isRequired={isRequired}
                                theme={theme}
                            >
                                {label}
                            </InputLabel>
                        </div>
                    )}

                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                    <div
                        ref={mergeRefs(anchorRef as RefObject<HTMLDivElement>, selectElementRef)}
                        id={id}
                        className={`${CLASSNAME}__wrapper`}
                        onClick={onInputClick}
                        onKeyDown={handleKeyboardNav}
                        tabIndex={isDisabled ? undefined : 0}
                        aria-disabled={isDisabled || undefined}
                        {...forwardedProps}
                    >
                        {icon && (
                            <Icon
                                className={`${CLASSNAME}__input-icon`}
                                color={theme === Theme.dark ? 'light' : undefined}
                                icon={icon}
                                size={Size.xs}
                            />
                        )}

                        <div className={`${CLASSNAME}__chips`}>
                            {!isEmpty &&
                                value.map((val, index) => selectedChipRender?.(val, index, onClear, isDisabled, theme))}
                        </div>

                        {isEmpty && placeholder && (
                            <div
                                className={classNames([
                                    `${CLASSNAME}__input-native`,
                                    `${CLASSNAME}__input-native--placeholder`,
                                ])}
                            >
                                <span>{placeholder}</span>
                            </div>
                        )}

                        {(isValid || hasError) && (
                            <div className={`${CLASSNAME}__input-validity`}>
                                <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xxs} />
                            </div>
                        )}

                        <div className={`${CLASSNAME}__input-indicator`}>
                            <Icon icon={mdiMenuDown} size={Size.s} />
                        </div>
                    </div>
                </>
            )}

            {variant === SelectVariant.chip && (
                <Chip
                    id={id}
                    isSelected={!isEmpty}
                    isDisabled={isDisabled}
                    after={<Icon icon={isEmpty ? mdiMenuDown : mdiCloseCircle} />}
                    onAfterClick={isEmpty ? onInputClick : onClear}
                    onClick={onInputClick}
                    ref={mergeRefs(anchorRef as RefObject<HTMLAnchorElement>, selectElementRef)}
                    theme={theme}
                    {...forwardedProps}
                >
                    {isEmpty && <span>{label}</span>}

                    {!isEmpty && (
                        <span>
                            <span>{selectedValueRender?.(value[0])}</span>

                            {value.length > 1 && <span>&nbsp;+{value.length - 1}</span>}
                        </span>
                    )}
                </Chip>
            )}
        </>
    );
};

/**
 * SelectMultiple component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SelectMultiple = forwardRef<SelectMultipleProps, HTMLDivElement>((props, ref) => {
    return WithSelectContext(
        SelectMultipleField,
        {
            ...DEFAULT_PROPS,
            ...props,
            className: classNames(
                props.className,
                handleBasicClasses({
                    hasMultiple: !props.isEmpty,
                    prefix: CLASSNAME,
                }),
            ),
            isEmpty: props.value.length === 0,
            isMultiple: true,
        },
        ref,
    );
});
SelectMultiple.displayName = COMPONENT_NAME;
SelectMultiple.className = CLASSNAME;
SelectMultiple.defaultProps = DEFAULT_PROPS;
