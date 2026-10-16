import { SelectList } from '@lumx/react';

const LOADING_TRANSLATIONS = {
    loadingMessage: 'Loading fruits…',
};

const ERROR_TRANSLATIONS = {
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};

export default () => (
    <>
        <SelectList
            aria-label="Loading fruits"
            minWidth="xxl"
            options={[]}
            getOptionId={String}
            listStatus="loading"
            translations={LOADING_TRANSLATIONS}
        />
        <SelectList
            aria-label="Failed fruits"
            options={[]}
            getOptionId={String}
            listStatus="error"
            translations={ERROR_TRANSLATIONS}
        />
    </>
);
