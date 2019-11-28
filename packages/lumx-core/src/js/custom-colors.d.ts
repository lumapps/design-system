interface IColorPalette {
    primary: {
        D2: string;
        D1: string;
        N: string;
        L1: string;
        L2: string;
        L3: string;
        L4: string;
        L5: string;
        L6: string;
    };
    secondary: {
        D2: string;
        D1: string;
        N: string;
        L1: string;
        L2: string;
        L3: string;
        L4: string;
        L5: string;
        L6: string;
    };
}

declare function setCustomColors(sheet: StyleSheet, theme: string, colorPalette: IColorPalette): void;

export { setCustomColors };
