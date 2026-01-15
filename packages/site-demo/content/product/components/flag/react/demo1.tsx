import { mdiHeart } from '@lumx/icons';
import { Flag } from '@lumx/react';

export default () => (
    <>
        <Flag icon={mdiHeart} color="blue" label="blue flag" />
        <Flag icon={mdiHeart} color="dark" label="dark flag" />
        <Flag icon={mdiHeart} color="green" label="green flag" />
        <Flag icon={mdiHeart} color="red" label="red flag" />
        <Flag icon={mdiHeart} color="yellow" label="yellow flag" />
    </>
);
