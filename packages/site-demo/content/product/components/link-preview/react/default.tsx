import { LinkPreview } from '@lumx/react';

const App = ({ theme }: any) => {
    return (
        <>
            <LinkPreview
                title={'Link title'}
                description={'Description'}
                url={'https://google.com'}
                theme={theme}
                thumbnail={'https://loremflickr.com/320/240'}
            />
        </>
    );
};

export default App;
