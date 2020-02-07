import { Engine, EngineContext } from '@lumx/demo/context/engine';
import React, { ReactElement, useContext } from 'react';

import { mdiAngularjs, mdiReact } from '@lumx/icons';
import { Button, Emphasis, Size } from '@lumx/react';

/////////////////////////////

/**
 * The engine selector component.
 * Display a select with the list of all available engines.
 * When a engine is selected, update the engine throughout the demo site and the components being demoed.
 *
 * @return The engine selector component.
 */
const EngineSelector: React.FC = (): ReactElement | null => {
    const { engine, changeEngine } = useContext(EngineContext);
    const onClick = (newEngine: Engine) => () => changeEngine?.(newEngine);

    switch (engine) {
        case Engine.react:
            return (
                <Button
                    emphasis={Emphasis.low}
                    leftIcon={mdiAngularjs}
                    onClick={onClick(Engine.angularjs)}
                    size={Size.s}
                >
                    View Angularjs version
                </Button>
            );
        case Engine.angularjs:
            return (
                <Button emphasis={Emphasis.low} leftIcon={mdiReact} onClick={onClick(Engine.react)} size={Size.s}>
                    View React version
                </Button>
            );
        default:
            return null;
    }
};

/////////////////////////////

export { EngineSelector };
