import { Theme } from './constants';

/////////////////////////////

declare function changeTheme(theme: Theme): Promise<Theme>;

/////////////////////////////

export { changeTheme };
