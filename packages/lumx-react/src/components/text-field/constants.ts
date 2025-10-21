import { getRootClassName } from '@lumx/core/js/utils';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TextField';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Input native element class name.
 */
export const INPUT_NATIVE_CLASSNAME = `${CLASSNAME}__input-native`;
