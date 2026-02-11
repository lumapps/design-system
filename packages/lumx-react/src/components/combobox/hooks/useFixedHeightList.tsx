export interface UseFixedHeightList {
    totalChoices: number;
    maxResults?: number;
    hasHeader?: boolean;
    shouldCalculateHeight?: boolean;
}

const AVERAGE_LIST_ITEM_HEIGHT = 36;
const MAX_LIST_ITEMS_FOR_SCROLL = 10;

export const useFixedHeightList = (props: UseFixedHeightList): number | undefined => {
    const { hasHeader, totalChoices, maxResults = MAX_LIST_ITEMS_FOR_SCROLL, shouldCalculateHeight = true } = props;
    /**
     * In order to calculate the height of the dropdown, we need to determine how many items we are currently
     * displaying and how many items we want to display.
     *
     * In essence, if there are more items than the desired results to display, we calculate the max height
     * of the list, removing either one or two items (depending whether the header is enabled) so that
     * we can leave a couple of pixels for the infinite scroll to kick in.
     */
    let heightList;

    if (totalChoices >= maxResults && shouldCalculateHeight) {
        heightList = (maxResults - (hasHeader ? 2 : 1)) * AVERAGE_LIST_ITEM_HEIGHT + AVERAGE_LIST_ITEM_HEIGHT / 3;
    }

    return heightList;
};
