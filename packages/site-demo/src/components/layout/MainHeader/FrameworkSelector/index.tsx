import React from 'react';
import { Button } from '@lumx/react';
import { mdiMenuDown, mdiReact, mdiVuejs } from '@lumx/icons';
import { useIsServerSide } from '@lumx/demo/utils/hooks/useIsServerSide';
import { useFramework, Framework } from '@lumx/demo/components/layout/FrameworkContext';

import './index.scss';

declare module 'react/jsx-runtime' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            selectedcontent: React.HTMLAttributes<HTMLElement>;
        }
    }
}
const CONFIG = {
    [Framework.react]: { label: 'React', icon: mdiReact },
    [Framework.vue]: { label: 'Vue', icon: mdiVuejs },
};

const SelectButton = ({ framework, children }: { framework: Framework; children?: React.ReactNode }) => (
    <Button size="s" emphasis="medium" leftIcon={CONFIG[framework].icon} rightIcon={mdiMenuDown} isDisabled={!children}>
        {children || framework}
    </Button>
);

export const FrameworkSelector: React.FC = () => {
    const { framework, setFramework } = useFramework();
    const selectRef = React.useRef<HTMLSelectElement>(null);
    const isServer = useIsServerSide();
    if (isServer) {
        return <SelectButton framework={framework} />;
    }

    return (
        <select
            className="framework-selector"
            ref={selectRef}
            value={framework}
            id="framework-selector"
            onChange={(e) => setFramework(e.target.value as Framework)}
            aria-label="Select framework"
        >
            <SelectButton framework={framework}>
                <selectedcontent />
            </SelectButton>
            {Object.values(Framework).map((f) => (
                <option key={f} value={f}>
                    {CONFIG[f].label}
                </option>
            ))}
        </select>
    );
};
