import React, { useState } from 'react';

/**
 * The available engines in the demo site.
 */
enum Engine {
    react = 'react',
    angularjs = 'angularjs',
}

type changeEngineType = null | ((engine: Engine) => void);

const DEFAULT = {
    changeEngine: null as changeEngineType,
    engine: Engine.react,
};

const EngineContext = React.createContext(DEFAULT);

/**
 * Provide the EngineContext in children components exposing the hidden state with the setter.
 *
 * @param children Children components.
 * @return The EngineProvider.
 */
const EngineProvider: React.FC = ({ children }) => {
    const [engine, changeEngine] = useState(DEFAULT.engine);
    return <EngineContext.Provider value={{ engine, changeEngine }}>{children}</EngineContext.Provider>;
};

export { Engine, EngineContext, EngineProvider };
