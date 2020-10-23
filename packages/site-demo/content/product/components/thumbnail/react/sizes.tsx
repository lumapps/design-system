import { Size, Thumbnail } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <Thumbnail image="https://picsum.photos/28" size={Size.xxs}/>
        <Thumbnail image="https://picsum.photos/40" size={Size.xs}/>
        <Thumbnail image="https://picsum.photos/48" size={Size.s}/>
        <Thumbnail image="https://picsum.photos/72" size={Size.m}/>
        <Thumbnail image="https://picsum.photos/128" size={Size.l}/>
        <Thumbnail image="https://picsum.photos/256" size={Size.xl}/>
        <div style={{ width: 300 }}>
            <Thumbnail image="https://picsum.photos/400"/>
        </div>
    </>
);

export default App;
