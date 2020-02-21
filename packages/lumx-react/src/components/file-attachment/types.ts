import { IconProps, ThumbnailProps } from '@lumx/react';
import { Omit } from '@lumx/react/utils';

export interface IFile {
    /** The file url. */
    url: string;
    /** The file title, displayed on top of the block. */
    title?: string;
    /** The file image preview. */
    thumbnail?: Omit<ThumbnailProps, 'size' | 'aspectRatio'>;
    /** The icon to display if no image is specified, displays a file Icon by default. */
    icon?: Omit<IconProps, 'size' | 'hasShape'>;
    /** The description of the file. */
    description?: string;
}
