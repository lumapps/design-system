import React from 'react';

export interface ReactDemo {
    default: React.FC<any>;
    scope: Record<string, any>;
    code: string;
    imports: string;
}

export interface VueDemo {
    default: string;
}

export interface Demo {
    react?: ReactDemo;
    vue?: VueDemo;
}
