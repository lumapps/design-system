// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

export type KeyboardEventHandler<E extends KeyboardEvent | React.KeyboardEvent> = (event: E) => void;
