export enum EllipsisType {
    START = 'start',
    END = 'end',
    MIDDLE = 'middle',
}

export interface TruncateParams {
    max: number;
    ellipsisType?: EllipsisType;
    separator?: string;
}

export const ELLIPSIS_CHARS = '...';

export const truncate = (
    text: string,
    { max = 0, ellipsisType = EllipsisType.END, separator = ELLIPSIS_CHARS }: TruncateParams,
) => {
    // If there is no need to crop
    if (text.length <= max) {
        return text;
    }

    if (ellipsisType === EllipsisType.END) {
        return text.substring(0, max) + separator;
    }

    if (ellipsisType === EllipsisType.MIDDLE) {
        const half = Math.round(max / 2);
        const firstPart = text.substring(0, half);
        const lastPart = text.substring(text.length - half, text.length + 1);
        return `${firstPart}${separator}${lastPart}`;
    }

    if (ellipsisType === EllipsisType.START) {
        const start = text.length - max;
        return separator + text.substring(start, text.length + 1);
    }

    return text;
};
