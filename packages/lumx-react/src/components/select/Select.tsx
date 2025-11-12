import React, { RefObject } from 'react';

import classNames from 'classnames';
import lodashIsEmpty from 'lodash/isEmpty';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle, mdiMenuDown } from '@lumx/icons';
import { Emphasis, Size, Theme } from '@lumx/core/js/constants';
import { IconButton } from '@lumx/react/components/button/IconButton';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Icon } from '@lumx/react/components/icon/Icon';
import { InputLabel } from '@lumx/react/components/input-label/InputLabel';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { WithSelectContext } from './WithSelectContext';
import { CoreSelectProps, SelectVariant } from './constants';

/** Defines the props of the component. */
export interface SelectProps extends CoreSelectProps {
    /** Selected value. */
    value: string;
}

export { SelectVariant };

/** The display name of the component. */
const COMPONENT_NAME = 'Select';

/** The default class name and classes prefix for this component. */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/** The default value of props. */
const DEFAULT_PROPS: Partial<SelectProps> = {
    selectedValueRender: (choice) => choice,
    variant: SelectVariant.input,
};

const stopPropagation = (evt: Event) => evt.stopPropagation();

/**
 * Select component.
 */
const SelectField: React.FC<SelectProps> = (props) => {
    const defaultTheme = useTheme();
    const {
        anchorRef,
        clearButtonProps,
        handleKeyboardNav,
        hasError,
        hasInputClear,
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

                        <div
                            className={classNames([
                                `${CLASSNAME}__input-native`,
                                isEmpty && placeholder && `${CLASSNAME}__input-native--placeholder`,
                            ])}
                        >
                            {!isEmpty && <span>{selectedValueRender?.(value)}</span>}

                            {isEmpty && placeholder && <span>{placeholder}</span>}
                        </div>

                        {(isValid || hasError) && (
                            <div className={`${CLASSNAME}__input-validity`}>
                                <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xxs} />
                            </div>
                        )}

                        {hasInputClear && clearButtonProps && (
                            <IconButton
                                {...clearButtonProps}
                                className={`${CLASSNAME}__input-clear`}
                                icon={mdiCloseCircle}
                                emphasis={Emphasis.low}
                                size={Size.s}
                                theme={theme}
                                onClick={onClear}
                                onKeyDown={stopPropagation}
                            />
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

                    {!isEmpty && <span>{selectedValueRender?.(value)}</span>}
                </Chip>
            )}
        </>
    );
};

/**
 * Select component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Select = forwardRef<SelectProps, HTMLDivElement>((props, ref) => {
    const isEmpty = lodashIsEmpty(props.value);
    const hasInputClear = props.onClear && props.clearButtonProps && !isEmpty;

    return WithSelectContext(
        SelectField,
        {
            ...DEFAULT_PROPS,
            ...props,
            className: classNames(
                props.className,
                handleBasicClasses({
                    hasInputClear,
                    hasUnique: !props.isEmpty,
                    prefix: CLASSNAME,
                }),
            ),
            hasInputClear,
            isEmpty,
        },
        ref,
    );
});
Select.displayName = COMPONENT_NAME;
Select.className = CLASSNAME;
Select.defaultProps = DEFAULT_PROPS;
Select.className = CLASSNAME;
