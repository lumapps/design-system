/**
 * Require either `aria-label` or `arial-labelledby` prop.
 * If none are set, the order will prioritize `aria-labelledby` over `aria-label` as it
 * needs a visible element.
 */
export type HasAriaLabelOrLabelledBy<T = string | undefined> = T extends string
    ? {
          /**
           * The id of the element to use as title of the dialog. Can be within or out of the dialog.
           * Although it is not recommended, aria-label can be used instead if no visible element is available.
           */
          'aria-labelledby': T;
          /** The label of the dialog. */
          'aria-label'?: undefined;
      }
    : {
          'aria-label': string;
          'aria-labelledby'?: undefined;
      };
