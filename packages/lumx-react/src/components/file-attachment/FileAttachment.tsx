import { mdiFile } from '@lumx/icons';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode, useMemo } from 'react';
import { AspectRatio, Size } from '..';
import { Icon } from '../icon/Icon';
import { Thumbnail, ThumbnailVariant } from '../thumbnail/Thumbnail';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IBaseFileAttachmentProps extends IGenericProps {
    /**
     * FileAttachment content.
     */
    children?: ReactNode;

    fileUrl?: string;

    fileTitle?: string;

    fileImage?: string;

    fileIcon?: ReactNode;

    fileDescription?: string;
}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}FileAttachment`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IBaseFileAttachmentProps = {
    fileIcon: <Icon size={Size.l} icon={mdiFile} />,
};

const FileAttachment: React.FC<IBaseFileAttachmentProps> = ({
    className,
    fileIcon = DEFAULT_PROPS.fileIcon,
    fileImage,
    fileTitle,
    fileUrl,
    fileDescription,
    ...props
}: IBaseFileAttachmentProps): ReactElement => {
    const fileName = useMemo(() => fileUrl?.substr(fileUrl.lastIndexOf('/') + 1) || '', [fileUrl]);

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {fileImage ? (
                <Thumbnail
                    size={Size.l}
                    variant={ThumbnailVariant.rounded}
                    aspectRatio={AspectRatio.square}
                    image={fileImage}
                />
            ) : (
                fileIcon
            )}
            <div className={`${CLASSNAME}__infos`}>
                <p className={`${CLASSNAME}__title`}>{fileTitle}</p>
                <p className={`${CLASSNAME}__description`}>{fileDescription}</p>
                <p className={`${CLASSNAME}__link`}>{fileName}</p>
            </div>
        </div>
    );
};

FileAttachment.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, FileAttachment, IBaseFileAttachmentProps };
