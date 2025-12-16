import { LumxClassName } from '@lumx/core/js/types';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TextField';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-text-field';

/**
 * Input native element class name.
 */
export const INPUT_NATIVE_CLASSNAME = `${CLASSNAME}__input-native`;
