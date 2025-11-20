import { Message, Kind } from '@lumx/react';

export const App = () => (
    <Message kind={Kind.warning} hasBackground>
        <p>
            Message text quisque tincidunt lobortis dui non auctor. Donec porta, ligula volutpat vehicula aliquet, dui
            sapien tempus felis, sed cursus diam ante.
        </p>
    </Message>
);
