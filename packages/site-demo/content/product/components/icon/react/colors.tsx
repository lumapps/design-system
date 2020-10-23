import { mdiAlert, mdiAlertCircle, mdiArrowRight, mdiBullhorn, mdiCheck, mdiMessageText } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <Icon icon={mdiArrowRight} size={Size.s} color={ColorPalette.blue}/>
        <Icon icon={mdiCheck} size={Size.s} color={ColorPalette.green}/>
        <Icon icon={mdiAlertCircle} size={Size.s} color={ColorPalette.yellow}/>
        <Icon icon={mdiAlert} size={Size.s} color={ColorPalette.red}/>
        <Icon icon={mdiBullhorn} size={Size.m} color={ColorPalette.blue} hasShape/>
        <Icon icon={mdiAlertCircle} size={Size.m} color={ColorPalette.yellow} hasShape/>
        <Icon icon={mdiAlert} size={Size.m} color={ColorPalette.red} hasShape/>
        <Icon icon={mdiCheck} size={Size.m} color={ColorPalette.green} hasShape/>
        <Icon icon={mdiMessageText} size={Size.m} hasShape/>
    </>
);

export default App;
