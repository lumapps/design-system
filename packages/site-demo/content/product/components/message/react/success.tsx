import { Message, MessageKind } from '@lumx/react';
import React from 'react';

const App = () => (
    <Message kind={MessageKind.success} hasBackground>
        <p>
            Message text quisque tincidunt lobortis dui non auctor. Donec porta, ligula volutpat vehicula aliquet, dui
            sapien tempus felis, sed cursus diam ante.
        </p>
    </Message>
);

export default App;
