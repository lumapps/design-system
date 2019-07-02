import React, { Fragment } from 'react';

import isEmpty from 'lodash/isEmpty';

import { Button, ButtonEmphasises, ButtonSizes } from 'LumX';
import { IGenericProps } from 'LumX/core/react/utils';
import { mdiAngular } from 'LumX/icons';

import { Category } from 'LumX/demo/react/constants';

/////////////////////////////
/**
 * Defines the props of the component
 */
interface IProps extends IGenericProps {
    /**
     * The category of the demo.
     */
    category?: Category;

    /**
     * The description of the demo.
     */
    children?: React.ReactNode;

    /**
     * The title of the demo.
     */
    demoTitle: string;
}

/////////////////////////////

/**
 * The header of a demo page.
 * This component will display the header with information like the category of the demo, the title of the page and a
 * description of the demo.
 *
 * @return The demo header component.
 */
const DemoHeader: React.FC<IProps> = ({
    category,
    children: description,
    demoTitle: title,
}: IProps): React.ReactElement => (
    <Fragment>
        <div lumx-grid-container="row">
            {!isEmpty(category) && (
                <div lumx-grid-item="true">
                    <span className="lumx-typography-overline lumx-theme-color-dark-L3">{category}</span>
                </div>
            )}

            <div>
                <Button leftIcon={mdiAngular} emphasis={ButtonEmphasises.low} size={ButtonSizes.s}>
                    View AngularJS version
                </Button>
            </div>
        </div>

        <h1 className="lumx-typography-display1 mt+">{title}</h1>

        {!isEmpty(description) && <div className="lumx-typography-subtitle2 mt+">{description}</div>}
    </Fragment>
);

/////////////////////////////

export { DemoHeader };
