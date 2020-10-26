import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Icon icon={mdiMessageTextOutline} size={Size.s} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.m} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.l} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.xl} hasShape />
    </>
);
