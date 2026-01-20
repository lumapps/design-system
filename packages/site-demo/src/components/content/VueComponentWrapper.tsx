import React, { useEffect, useRef } from 'react';
import { createApp, Component as VueComponent } from 'vue';

interface VueComponentWrapperProps {
    component: VueComponent;
}

export const VueComponentWrapper: React.FC<VueComponentWrapperProps> = ({ component }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !component) return;

        const app = createApp(component);
        app.mount(ref.current);

        return () => {
            app.unmount();
        };
    }, [component]);

    return <div ref={ref} />;
};
