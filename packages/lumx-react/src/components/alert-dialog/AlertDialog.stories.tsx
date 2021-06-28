import React, { RefObject, useRef, useState } from 'react';
import { Button, Theme, Link } from '@lumx/react';
import { AlertDialog } from './AlertDialog';

export default {
    title: 'LumX components/alert-dialog/AlertDialog',
    parameters: {
        // Notifies Chromatic to pause the animations when they finish for the specific story.
        chromatic: { pauseAnimationAtEnd: true },
    },
};

const defaultProps = {
    id: 'alert-dialog',
    confirmProps: { onClick: () => alert('confirm'), label: 'OK' },
};

function useOpenButton(theme: Theme) {
    const buttonRef = useRef() as RefObject<HTMLButtonElement>;
    const [isOpen, setOpen] = useState(true);
    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return {
        button: (
            <Button ref={buttonRef} onClick={openDialog} theme={theme}>
                Open dialog
            </Button>
        ),
        buttonRef,
        closeDialog,
        isOpen,
    };
}

export const Default = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                isOpen={isOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
                title="Default (info)"
                confirmProps={{ onClick: () => console.log('confirm'), label: 'Confirm' }}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const Warning = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                isOpen={isOpen}
                title="Warning"
                onClose={closeDialog}
                parentElement={buttonRef}
                kind="warning"
                {...defaultProps}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const Success = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                isOpen={isOpen}
                title="Success"
                onClose={closeDialog}
                parentElement={buttonRef}
                kind="success"
                {...defaultProps}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const Error = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                isOpen={isOpen}
                title="Error"
                onClose={closeDialog}
                parentElement={buttonRef}
                kind="error"
                {...defaultProps}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const WithCancel = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                {...defaultProps}
                title="With Cancel"
                isOpen={isOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
                cancelProps={{
                    label: 'Cancel',
                    onClick: closeDialog,
                }}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};

export const RichDescription = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                {...defaultProps}
                title="With Rich Description"
                isOpen={isOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
            >
                Amet ut elit dolore irure mollit <strong>sunt culpa esse</strong>.<br />
                Ea ut Lorem.
                <br />
                <Link href="https://example.com" target="_blank">
                    Link
                </Link>
            </AlertDialog>
        </>
    );
};

export const WithForwardedProps = ({ theme }: any) => {
    const { button, buttonRef, closeDialog, isOpen } = useOpenButton(theme);

    return (
        <>
            {button}
            <AlertDialog
                {...defaultProps}
                title="With Forwarded Props"
                isOpen={isOpen}
                onClose={closeDialog}
                parentElement={buttonRef}
                cancelProps={{
                    label: 'Cancel',
                    onClick: closeDialog,
                    style: { color: 'blue' },
                }}
                confirmProps={{
                    onClick: () => alert('confirm'),
                    label: 'OK',
                    style: { color: 'red' },
                }}
            >
                Consequat deserunt officia aute laborum tempor anim sint est.
            </AlertDialog>
        </>
    );
};
