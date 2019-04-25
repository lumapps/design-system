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
        <Slideshow activeIndex={6} hasControls={true} theme={theme} autoPlay={true} groupBy={1}>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=24" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=25" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=26" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=27" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=28" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=29" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=30" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=31" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=32" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=33" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=34" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=35" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=36" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=37" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=38" alt="Pic Sum" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/640/480/?image=39" alt="Pic Sum" />
            </SlideshowItem>
        </Slideshow>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
