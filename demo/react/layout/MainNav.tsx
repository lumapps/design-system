import React, { ReactElement } from 'react';

import { LumXLogo } from '../../assets/images';

/////////////////////////////

/**
 * The main navigation component.
 * This component will display the main navigation bar.
 *
 * @return The main navigation component.
 */
const MainNav: React.FC = (): ReactElement => (
    <div className="main-nav">
        <ul className="main-nav__wrapper">
            <li className="main-nav__logo">
                <img src={LumXLogo} alt="LumX" />
            </li>

            <li className="main-nav__item">
                <a className="main-nav__link main-nav__link--is-selected">Pr</a>
            </li>
            <li className="main-nav__item">
                <a className="main-nav__link">Ma</a>
            </li>
        </ul>
    </div>
);

/////////////////////////////

export { MainNav };
