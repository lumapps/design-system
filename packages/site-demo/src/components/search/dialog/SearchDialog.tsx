/* eslint-disable react/no-danger */
import { useEffect, useRef } from 'react';
import { Link, navigate } from 'gatsby';

import {
    Dialog,
    DialogProps,
    Flag,
    FlexBox,
    IconButton,
    List,
    ListItem,
    ProgressCircular,
    TextField,
} from '@lumx/react';
import { mdiClose, mdiMagnify } from '@lumx/icons';

import { useSearch } from './useSearch';
import { useFramework } from '../../layout/FrameworkContext';

import './SearchDialog.scss';

type SearchDialogProps = Pick<Required<DialogProps>, 'isOpen' | 'onClose' | 'parentElement' | 'onVisibilityChange'>;

export const SearchDialog: React.FC<SearchDialogProps> = (props) => {
    const { isOpen, onClose, parentElement, onVisibilityChange } = props;
    const inputRef = useRef<HTMLElement>(null);
    const { framework } = useFramework();
    const otherFramework = framework === 'react' ? 'vue' : 'react';
    const { query, setQuery, results } = useSearch(framework);

    // TODO: replace this with a true combobox pattern (taking inspiration from https://webpack.js.org).
    const { activeItemIndex, setActiveItemIndex } = List.useKeyboardListNavigation(
        results || [],
        inputRef,
        (result) => navigate(result.slug),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
    );

    // Reset item selection on result change
    useEffect(() => {
        if (results) {
            setActiveItemIndex(0);
        }
    }, [setActiveItemIndex, results]);

    return (
        <Dialog
            className="search-dialog"
            isOpen={isOpen}
            onClose={onClose}
            focusElement={inputRef}
            parentElement={parentElement}
            onVisibilityChange={onVisibilityChange}
        >
            <header>
                <form onSubmit={(evt) => evt.preventDefault()}>
                    <TextField
                        className="search-box"
                        type="search"
                        icon={mdiMagnify}
                        placeholder="Search documentation"
                        inputRef={inputRef as any}
                        value={query}
                        onChange={setQuery}
                        clearButtonProps={{
                            label: 'Clear query',
                        }}
                    />
                </form>
                <IconButton label="Close" onClick={onClose} icon={mdiClose} emphasis="low" />
            </header>

            {!results ? (
                <ProgressCircular />
            ) : (
                <List className="search-results">
                    {results.map((result, index) => (
                        <ListItem
                            key={result.slug}
                            className="search-result"
                            linkAs={Link}
                            linkProps={{ href: '#', to: result.slug } as any}
                            isSelected={index === activeItemIndex}
                        >
                            <FlexBox orientation="horizontal" gap="regular" hAlign="center">
                                <p className="search-result__path">
                                    {result.parentTitlePath?.map((parent) => <span key={parent}>{parent}</span>)}
                                    <span dangerouslySetInnerHTML={{ __html: result.title }} />
                                </p>
                                {result.frameworks && !result.frameworks.includes(framework) && (
                                    <Flag color="yellow" label={`${otherFramework} only`} />
                                )}
                            </FlexBox>
                            {result.content && (
                                <p
                                    className="search-result__content"
                                    dangerouslySetInnerHTML={{ __html: result.content }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Dialog>
    );
};
export default SearchDialog;
