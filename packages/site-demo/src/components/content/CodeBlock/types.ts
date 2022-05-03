export interface Token {
    types: string[];
    content: string;
    empty?: boolean;
}

export interface RenderLineParams {
    tokens: TokenLines;
    getLineProps: any;
    getTokenProps: any;
}

export type TokenLines = Token[][];
