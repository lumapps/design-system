import type { KebabCase } from './KebabCase';

/** Transform the component name into the lumx class name. */
export type ComponentClassName<
    TComponentName extends string,
    TSubComponentName extends string = '',
> = `lumx-${KebabCase<TComponentName>}${TSubComponentName extends `${TComponentName}${infer TSubName}` ? `__${KebabCase<TSubName>}` : ''}`;
