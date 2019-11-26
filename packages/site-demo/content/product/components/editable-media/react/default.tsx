import React, { useState } from 'react';

import { EditableMedia, IconButton, Size } from '@lumx/react';
import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';

const App = ({ theme }) => {
    const [image, setImage] = useState();
    const handleClick = () => {
        const newImage = image ? undefined : 'https://picsum.photos/400/400/?random';
        setImage(newImage);
    };

    const removeImage = () => {
        setImage();
    };

    const getControls = (size = 'm') => (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="lumx-spacing-margin-right-regular">
                <IconButton
                    color="dark"
                    emphasis="low"
                    hasBackground={true}
                    icon={mdiPencil}
                    size={size}
                />
            </div>

            <div className="lumx-spacing-margin-right-regular">
                <IconButton
                    color="dark"
                    emphasis="low"
                    hasBackground={true}
                    icon={mdiEye}
                    size={size}
                />
            </div>

            <div>
                <IconButton
                    color="dark"
                    emphasis="low"
                    hasBackground={true}
                    onClick={removeImage}
                    icon={mdiDelete}
                    size={size}
                />
            </div>
        </div>
    );

    return(
        <>
            <EditableMedia
                helper="Pick or upload a picture. It will show up in the preview of this content."
                label="Featured Image"
                placeholder="Add featured image"
                image={image}
                theme={theme}
                onClick={handleClick}
                theme={theme}
            >
                {getControls()}
            </EditableMedia>

            <EditableMedia
                placeholder="Add profile picture"
                image={image}
                theme={theme}
                variant="avatar"
                onClick={handleClick}
                size={Size.xl}
                theme={theme}
            >
                {getControls('s')}
            </EditableMedia>
        </>
    );
};

export default App;
