import React, { RefObject } from 'react';

import classNames from 'classnames';
import lodashIsEmpty from 'lodash/isEmpty';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle, mdiMenuDown } from '@lumx/icons';

import { Emphasis, Size } from '@lumx/react/components';
import { IconButton } from '@lumx/react/components/button/IconButton';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Icon } from '@lumx/react/components/icon/Icon';
import { InputLabel } from '@lumx/react/components/input-label/InputLabel';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { withSelectContext } from './WithSelectContext';
import { CoreSelectProps, SelectVariant } from './constants';

/** Defines the props of the component. */
interface SelectProps extends CoreSelectProps {
    /** The selected value. */
    value: string;
}

/** Define the types of the default props. */
interface DefaultPropsType extends Partial<SelectProps> {}

/** The display name of the component. */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Select`;

/** The default class name and classes prefix for this component. */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/** The default value of props. */
const DEFAULT_PROPS: DefaultPropsType = {
    hasError: false,
    isOpen: false,
    isValid: false,
    selectedValueRender: (choice) => choice,
};

const stopPropagation = (evt: Event) => evt.stopPropagation();

/**
 * Select component.
 *
 * @return The component.
 */
const SelectField: React.FC<SelectProps> = ({
    variant,
    label,
    value,
    isEmpty,
    isValid,
    hasError,
    onClear,
    onInputClick,
    theme,
    placeholder,
    handleKeyboardNav,
    targetUuid,
    anchorRef,
    isRequired,
    hasInputClear,
    selectedValueRender = DEFAULT_PROPS.selectedValueRender,
}) => {
    return (
        <>
            {variant === SelectVariant.input && (
                <>
                    {label && (
                        <div className={`${CLASSNAME}__header`}>
                            <InputLabel
                                htmlFor={targetUuid}
                                className={`${CLASSNAME}__label`}
                                isRequired={isRequired}
                                theme={theme}
                            >
                                {label}
                            </InputLabel>
                        </div>
                    )}

                    <div
                        ref={anchorRef as RefObject<HTMLDivElement>}
                        id={targetUuid}
                        className={`${CLASSNAME}__wrapper`}
                        onClick={onInputClick}
                        onKeyDown={handleKeyboardNav}
                        tabIndex={0}
                    >
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

                        {!isEmpty && (
                            <div className={`${CLASSNAME}__input-native`}>
                                <span>{selectedValueRender!(value)}</span>
                            </div>
                        )}

                        {(isValid || hasError) && (
                            <div className={`${CLASSNAME}__input-validity`}>
                                <Icon icon={isValid ? mdiCheckCircle : mdiAlertCircle} size={Size.xxs} />
                            </div>
                        )}

                        {hasInputClear && (
                            <IconButton
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
                    id={targetUuid}
                    isSelected={!isEmpty}
                    after={<Icon icon={isEmpty ? mdiMenuDown : mdiCloseCircle} />}
                    onAfterClick={isEmpty ? onInputClick : onClear}
                    onClick={onInputClick}
                    chipRef={anchorRef as RefObject<HTMLAnchorElement>}
                    theme={theme}
                >
                    {isEmpty && <span>{label}</span>}

                    {!isEmpty && <span>{selectedValueRender!(value)}</span>}
                </Chip>
            )}
        </>
    );
};

const Select = (props: SelectProps) => {
    const isEmpty = lodashIsEmpty(props.value);
    const hasInputClear = props.onClear && !isEmpty;

    return withSelectContext(SelectField, {
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
    });
};

Select.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Select, SelectProps, SelectVariant };
