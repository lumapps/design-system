import React, { Fragment } from 'react';

import { Slideshow, Theme } from 'LumX';
import { SlideshowItem } from 'LumX/components/slideshow/react/SlideshowItem';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <Slideshow>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <Slideshow activeIndex={1} hasControls={true} theme={theme} autoPlay={true}>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?random" alt="Pic Sum" />
            </SlideshowItem>
        </Slideshow>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
