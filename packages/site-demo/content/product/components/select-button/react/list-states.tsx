import { SelectButton } from '@lumx/react';

const LOADING_TRANSLATIONS = {
    loadingMessage: 'Loading fruits…',
};

const ERROR_TRANSLATIONS = {
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};

export default () => (
    <>
        <SelectButton
            label="Loading fruits"
            options={[]}
            getOptionId={String}
            listStatus="loading"
            translations={LOADING_TRANSLATIONS}
        />
        <SelectButton
            label="Failed fruits"
            options={[]}
            getOptionId={String}
            listStatus="error"
            translations={ERROR_TRANSLATIONS}
        />
    </>
);
