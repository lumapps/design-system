import { withWrapper } from './withWrapper';

/** Storybook decorator wrapping story in a resizable box  */
export const withResizableBox = ({
    width = 150,
    height = 50,
    ...style
}: { width?: number | string; height?: number | string; [key: string]: any } = {}) => {
    return withWrapper({
        style: {
            display: 'flex',
            width,
            height,
            border: '1px solid red',
            resize: 'both',
            overflow: 'hidden',
            ...style,
        },
    });
};
