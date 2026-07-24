import type { LumxClassName } from '../../types';
import { classNames } from '../../utils';

/**
 * Dialog label id key in IdsRegistry
 */
export const DIALOG_LABEL_KEY = 'dialog-label';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Dialog';

/**
 * `DialogHeading` component display name.
 */
export const DIALOG_HEADING_COMPONENT_NAME = 'DialogHeading';

/**
 * Component default class name and class prefix. Shared by the shell and the container modules.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-dialog';
export const { block, element } = classNames.bem(CLASSNAME);
