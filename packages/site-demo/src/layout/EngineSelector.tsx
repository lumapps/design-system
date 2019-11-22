import React, { ReactElement } from 'react';

import { mdiAngularjs, mdiReact } from '@lumx/icons';
import { Button, Emphasis, Size } from '@lumx/react';

import { Engine } from '@lumx/demo/constants';

import { IGenericProps } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps extends IGenericProps {
    /**
     * The current selected engine.
     */
    engine: Engine;
    /**
     * The function to change the engine.
     * When the engine selector is used, this function is called to update the current engine.
     */
    changeEngine(engine: Engine): void;
}

/////////////////////////////

/**
 * The engine selector component.
 * Display a select with the list of all available engines.
 * When a engine is selected, update the engine throughout the demo site and the components being demoed.
 *
 * @return The engine selector component.
 */
const EngineSelector: React.FC<IProps> = ({ changeEngine, engine }: IProps): ReactElement | null => {
    switch (engine) {
        case 'react':
            return (
                <Button
                    emphasis={Emphasis.low}
                    leftIcon={mdiAngularjs}
                    onClick={() => changeEngine('angularjs')}
                    size={Size.s}
                >
                    View Angularjs version
                </Button>
            );
        case 'angularjs':
            return (
                <Button emphasis={Emphasis.low} leftIcon={mdiReact} onClick={() => changeEngine('react')} size={Size.s}>
                    View React version
                </Button>
            );
        default:
            return null;
    }
};

/////////////////////////////

export { EngineSelector };
