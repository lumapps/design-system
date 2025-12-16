import type { KebabCase } from './KebabCase';

/** Transform the component name into the lumx class name. */
export type LumxClassName<TComponentName extends string> = `lumx-${KebabCase<TComponentName>}`;
